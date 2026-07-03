import { Injectable, Logger } from '@nestjs/common';
import {
    UploadImageRequest,
    UploadImageResponse,
    DeleteImageRequest,
    DeleteImageResponse,
    ListImagesRequest,
    ListImagesResponse,
    DownloadImageRequest,
    DownloadImageResponse
} from './interfaces/gcs.interfaces';
import { GcsConfig } from './config/gcs.config';

const UPLOAD_MAX_ATTEMPTS = 4;
const UPLOAD_RETRY_BASE_DELAY_MS = 400;

// Transient failures (frequently seen as ERR_STREAM_PREMATURE_CLOSE when the
// google-auth token fetch runs on newer Node) that are worth retrying. Once a
// token is fetched successfully it is cached (~1h), so a retry that lands one
// good attempt makes subsequent uploads succeed too.
const RETRYABLE_ERROR_PATTERNS = [
    'ERR_STREAM_PREMATURE_CLOSE',
    'premature close',
    'ECONNRESET',
    'ETIMEDOUT',
    'EAI_AGAIN',
    'socket hang up',
    'network socket disconnected',
];

@Injectable()
export class GcsAdapter {
    private readonly logger = new Logger(GcsAdapter.name);
    private folder: string;

    constructor(
        private gcsConfig: GcsConfig,
    ) {
        this.folder = this.gcsConfig.getConfig().folder_name;
    }

    private is_retryable_error(error: unknown): boolean {
        const parts: string[] = [];
        if (error && typeof error === 'object') {
            const err = error as { code?: unknown; message?: unknown; cause?: unknown };
            if (typeof err.code === 'string') parts.push(err.code);
            if (typeof err.message === 'string') parts.push(err.message);
            const cause = err.cause as { code?: unknown; message?: unknown } | undefined;
            if (cause && typeof cause === 'object') {
                if (typeof cause.code === 'string') parts.push(cause.code);
                if (typeof cause.message === 'string') parts.push(cause.message);
            }
        }

        const haystack = parts.join(' ').toLowerCase();
        return RETRYABLE_ERROR_PATTERNS.some((pattern) =>
            haystack.includes(pattern.toLowerCase()),
        );
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public async uploadImage(request: UploadImageRequest): Promise<UploadImageResponse> {
        let last_error: unknown;

        for (let attempt = 1; attempt <= UPLOAD_MAX_ATTEMPTS; attempt++) {
            try {
                return await this.upload_image_once(request);
            } catch (error) {
                last_error = error;

                if (attempt >= UPLOAD_MAX_ATTEMPTS || !this.is_retryable_error(error)) {
                    break;
                }

                const backoff = UPLOAD_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
                this.logger.warn(
                    `Upload attempt ${attempt}/${UPLOAD_MAX_ATTEMPTS} failed with a transient error; retrying in ${backoff}ms`,
                );
                await this.delay(backoff);
            }
        }

        this.logger.error('Upload error:', last_error);
        const message =
            last_error instanceof Error ? last_error.message : String(last_error);
        throw new Error(`Failed to upload image: ${message}`);
    }

    private upload_image_once(request: UploadImageRequest): Promise<UploadImageResponse> {
        const storage = this.gcsConfig.getStorageClient();
        const bucketName = request.bucket || this.gcsConfig.getBucketName();
        const bucket = storage.bucket(bucketName);

        const folder = request.folder || this.folder;
        const filename = `${folder}/${Date.now()}-${request.filename}`;

        const file = bucket.file(filename);

        const stream = file.createWriteStream({
            metadata: {
                contentType: request.contentType,
            },
            // Non-resumable (single-request) upload. Fewer HTTP requests per
            // upload means fewer chances to hit the intermittent auth token
            // fetch failure (ERR_STREAM_PREMATURE_CLOSE) seen on Node 24 with
            // the node-fetch transport bundled in gaxios 6. The retry wrapper
            // above recovers from transient failures; once a token is fetched
            // it is cached (~1h) so subsequent uploads reuse it.
            resumable: false,
            // public: request.public || false,
        });

        return new Promise((resolve, reject) => {
            stream.on('error', (error) => {
                reject(error);
            });

            stream.on('finish', async () => {
                try {
                    const [metadata] = await file.getMetadata();
                    const url = `https://storage.googleapis.com/${bucketName}/${filename}`;

                    resolve({
                        url,
                        filename,
                        size: parseInt(String(metadata.size)),
                        contentType: metadata.contentType,
                        bucket: bucketName,
                        path: filename,
                    });
                } catch (error) {
                    reject(error);
                }
            });

            stream.end(request.file);
        });
    }

    public async deleteImage(request: DeleteImageRequest): Promise<DeleteImageResponse> {
        try {
            const storage = this.gcsConfig.getStorageClient();
            const bucketName = this.gcsConfig.getBucketName();
            const bucket = storage.bucket(bucketName);

            const file = bucket.file(request.filename);
            await file.delete({ ignoreNotFound: true });

            return {
                success: true,
                filename: request.filename
            };
        } catch (error) {
            this.logger.error('Delete error:', error);
            const message =
                error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to delete image: ${message}`);
        }
    }

    public async listImages(request?: ListImagesRequest): Promise<ListImagesResponse> {
        try {
            const storage = this.gcsConfig.getStorageClient();
            const bucketName = this.gcsConfig.getBucketName();
            const bucket = storage.bucket(bucketName);

            const folder = request.folder || this.folder;
            const prefix = request.prefix ? `${folder}/${request.prefix}` : `${folder}/`;
            const maxResults = request.maxResults || 100;

            const [files] = await bucket.getFiles({
                prefix,
                maxResults
            });

            const documents = await Promise.all(
                files.map(async (file) => {
                    const [metadata] = await file.getMetadata();
                    const url = `https://storage.googleapis.com/${bucketName}/${file.name}`;

                    return {
                        name: file.name,
                        url,
                        size: parseInt(String(metadata.size)),
                        contentType: metadata.contentType,
                        created: new Date(metadata.timeCreated)
                    };
                })
            );

            return {
                documents,
                nextPageToken: files.length === maxResults ? 'has_more' : undefined
            };
        } catch (error) {
            this.logger.error('List documents error:', error);
            throw new Error(`Failed to list documents: ${error.message}`);
        }
    }

    public async getSignedUrl(filename: string, folder?: string, expiresInMinutes: number = 60): Promise<string> {
        try {
            const storage = this.gcsConfig.getStorageClient();
            const bucketName = this.gcsConfig.getBucketName();
            const bucket = storage.bucket(bucketName);

            const folderPath = folder || this.folder;
            const fullPath = `${folderPath}/${filename}`;

            const file = bucket.file(fullPath);
            const [signedUrl] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + expiresInMinutes * 60 * 1000,
            });

            return signedUrl;
        } catch (error) {
            this.logger.error('Get signed URL error:', error);
            throw new Error(`Failed to get signed URL: ${error.message}`);
        }
    }

    public async downloadImage(request: DownloadImageRequest): Promise<DownloadImageResponse> {
        try {
            const storage = this.gcsConfig.getStorageClient();
            const bucketName = this.gcsConfig.getBucketName();
            const bucket = storage.bucket(bucketName);

            const filePath = request.folder ? `${request.folder}/${request.filename}` : request.filename;
            const file = bucket.file(filePath);

            const [exists] = await file.exists();
            if (!exists) {
                throw new Error(`File not found: ${filePath}`);
            }

            const [buffer] = await file.download();
            const [metadata] = await file.getMetadata();

            return {
                buffer: Buffer.from(buffer),
                contentType: metadata.contentType || 'application/octet-stream'
            };
        } catch (error) {
            this.logger.error('Download image error:', error);
            throw new Error(`Failed to download image: ${error.message}`);
        }
    }
}
