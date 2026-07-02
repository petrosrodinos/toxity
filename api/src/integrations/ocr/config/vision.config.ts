import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class VisionConfig {
    private vision_client: ImageAnnotatorClient | null = null;
    private readonly logger = new Logger(VisionConfig.name);

    constructor(private readonly config_service: ConfigService) {
        this.init_vision();
    }

    private init_vision(): void {
        try {
            const project_id = this.config_service.get<string>('GCS_PROJECT_ID');
            const credentials_path =
                this.config_service.get<string>('GOOGLE_VISION_CREDENTIALS_PATH') ||
                this.config_service.get<string>('GCS_CREDENTIALS_PATH');
            const credentials_json =
                this.config_service.get<string>('GCS_CREDENTIALS');

            if (!project_id) {
                this.logger.warn(
                    'GCS_PROJECT_ID not set — OCR via Google Vision unavailable',
                );
                return;
            }

            const client_options: {
                projectId: string;
                keyFilename?: string;
                credentials?: object;
            } = { projectId: project_id };

            if (credentials_path) {
                client_options.keyFilename = credentials_path;
            } else if (credentials_json) {
                client_options.credentials = JSON.parse(credentials_json);
            }

            this.vision_client = new ImageAnnotatorClient(client_options);
            this.logger.debug('Google Cloud Vision client initialized');
        } catch (error) {
            this.logger.error('Error initializing Google Cloud Vision', error);
        }
    }

    get_client(): ImageAnnotatorClient | null {
        return this.vision_client;
    }

    is_configured(): boolean {
        return this.vision_client !== null;
    }
}
