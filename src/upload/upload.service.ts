import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION') || 'eu-west-3';
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME') || 'enerver-api-assets';

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async uploadToS3(file: Express.Multer.File): Promise<{ document_uuid: string; document_url: string; filename: string; s3_key: string }> {
    const document_uuid = uuidv4();
    const extension = file.originalname.split('.').pop();
    const key = `uploads/${document_uuid}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    const document_url = `https://${this.bucketName}.s3.eu-west-3.amazonaws.com/${key}`;

    return {
      document_uuid,
      document_url,
      filename: file.originalname,
      s3_key: key,
    };
  }
}
