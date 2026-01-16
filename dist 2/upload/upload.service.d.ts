import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    private s3Client;
    private bucketName;
    constructor(configService: ConfigService);
    uploadToS3(file: Express.Multer.File): Promise<{
        document_uuid: string;
        document_url: string;
        filename: string;
        s3_key: string;
    }>;
}
