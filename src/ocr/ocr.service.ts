import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} from '@aws-sdk/client-textract';

@Injectable()
export class OcrService {
  private textractClient: TextractClient;
  private bucketName: string;
  private readonly POLLING_INTERVAL = 5000; // 5 seconds

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION') || 'eu-west-3';
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME') || 'enerver-api-assets';

    const credentials = {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
    };

    this.textractClient = new TextractClient({
      region,
      credentials,
    });
  }

  async analyzeWithTextract(s3Key: string, documentUuid: string): Promise<{ document_uuid: string; text: string; status: string }> {
    try {
      console.log(`[OCR] Starting Textract analysis for ${s3Key}`);

      // Start Textract analysis
      const startCommand = new StartDocumentAnalysisCommand({
        DocumentLocation: {
          S3Object: {
            Bucket: this.bucketName,
            Name: s3Key,
          },
        },
        FeatureTypes: ['TABLES', 'FORMS', 'LAYOUT'],
      });

      const startResponse = await this.textractClient.send(startCommand);
      const jobId = startResponse.JobId;

      if (!jobId) {
        throw new Error('Failed to start Textract job');
      }

      console.log(`[OCR] Textract job started: ${jobId}`);

      // Wait for job completion
      const result = await this.waitForTextractCompletion(jobId);

      // Extract text from blocks
      const extractedText = this.extractTextFromBlocks(result.Blocks);

      console.log(`[OCR] Textract completed for ${documentUuid}: ${extractedText.length} characters`);

      return {
        document_uuid: documentUuid,
        text: extractedText,
        status: 'completed',
      };
    } catch (error) {
      console.error(`[OCR Error] Failed to analyze ${s3Key}:`, error);
      throw error;
    }
  }

  private async waitForTextractCompletion(jobId: string): Promise<any> {
    let status = 'IN_PROGRESS';
    let allBlocks: any[] = [];
    let nextToken: string | undefined;

    while (status === 'IN_PROGRESS') {
      await new Promise((resolve) => setTimeout(resolve, this.POLLING_INTERVAL));

      const getCommand = new GetDocumentAnalysisCommand({
        JobId: jobId,
      });

      const response = await this.textractClient.send(getCommand);
      status = response.JobStatus || 'FAILED';

      if (status === 'SUCCEEDED') {
        allBlocks = response.Blocks || [];
        nextToken = response.NextToken;

        // Retrieve all pages if there are multiple
        while (nextToken) {
          const nextCommand = new GetDocumentAnalysisCommand({
            JobId: jobId,
            NextToken: nextToken,
          });

          const nextResponse = await this.textractClient.send(nextCommand);
          allBlocks = allBlocks.concat(nextResponse.Blocks || []);
          nextToken = nextResponse.NextToken;
        }

        return {
          JobId: jobId,
          JobStatus: status,
          Blocks: allBlocks,
        };
      } else if (status === 'FAILED') {
        throw new Error(`Textract job ${jobId} failed`);
      }
    }
  }

  private extractTextFromBlocks(blocks: any[]): string {
    if (!blocks || blocks.length === 0) {
      return '';
    }

    // Extract text from LINE blocks
    const lines = blocks
      .filter((block) => block.BlockType === 'LINE')
      .map((block) => block.Text || '')
      .filter((text) => text.length > 0);

    return lines.join('\n');
  }
}
