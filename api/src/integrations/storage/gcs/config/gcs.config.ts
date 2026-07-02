import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { parse_gcs_credentials_from_base64 } from '@/shared/utils/gcs-credentials.utils';
import { GcsConfig as GcsConfigInterface } from '../interfaces/gcs.interfaces';

@Injectable()
export class GcsConfig {
    private storageClient: Storage;
    private readonly logger = new Logger(GcsConfig.name);
    private config: GcsConfigInterface;

    constructor(private readonly configService: ConfigService) {
        this.initGcs();
    }

    private initGcs() {
        try {
            const projectId = this.configService.get('GCS_PROJECT_ID');
            const bucketName = this.configService.get('GCS_BUCKET_NAME');
            const credentials_json_base64 = this.configService.get<string>(
                'GCS_CREDENTIALS_JSON_BASE64',
            );
            const credentials_json = this.configService.get<string>('GCS_CREDENTIALS');
            const folderName = this.configService.get('GCS_FOLDER_NAME');

            if (!projectId || !bucketName) {
                this.logger.error('GCS_PROJECT_ID and GCS_BUCKET_NAME are required');
                return;
            }

            const credentials =
                parse_gcs_credentials_from_base64(credentials_json_base64) ??
                (credentials_json ? JSON.parse(credentials_json) : undefined);

            this.config = {
                project_id: projectId,
                bucket_name: bucketName,
                credentials,
                folder_name: folderName || 'documents',
            };

            const storageOptions: {
                projectId: string;
                credentials?: object;
            } = {
                projectId: this.config.project_id,
            };

            if (this.config.credentials) {
                storageOptions.credentials = this.config.credentials;
            }

            this.storageClient = new Storage(storageOptions);
            this.logger.debug('Google Cloud Storage initialized');
        } catch (error) {
            this.logger.error('Error initializing Google Cloud Storage', error);
        }
    }

    getStorageClient(): Storage {
        return this.storageClient;
    }

    getConfig(): GcsConfigInterface {
        return this.config;
    }

    getBucketName(): string {
        return this.config.bucket_name;
    }
}
