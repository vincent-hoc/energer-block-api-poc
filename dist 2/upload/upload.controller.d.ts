import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): Promise<{
        document_uuid: string;
        document_url: string;
        filename: string;
        s3_key: string;
    }>;
}
