import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnalyzeDto } from './analyze.dto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} from '@aws-sdk/client-textract';

@Injectable()
export class AnalyzeService {
  private s3Client: S3Client;
  private textractClient: TextractClient;
  private bucketName: string;
  private chatbaseApiUrl: string;
  private chatbaseBearerToken: string;
  private chatbaseSummarizeChatbotId: string;
  private chatbaseFostIdentificationId: string;
  private chatbaseOcodeChatbotId: string;

  private readonly TEXTRACT_POLLING_INTERVAL = 5000; // 5 seconds

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const chatbaseApiUrl = this.configService.get<string>('CHATBASE_API_URL');
    const chatbaseBearerToken = this.configService.get<string>('CHATBASE_BEARER_TOKEN');
    const chatbaseSummarizeChatbotId = this.configService.get<string>('CHATBASE_SUMMARIZE_CHATBOT_ID');
    const chatbaseFostIdentificationId = this.configService.get<string>('CHATBASE_FOST_IDENTIFICATION_CHATBOT_ID');
    const chatbaseOcodeChatbotId = this.configService.get<string>('CHATBASE_OCODE_CHATBOT_ID');

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('Missing AWS configuration in environment variables');
    }

    if (!chatbaseApiUrl || !chatbaseBearerToken || !chatbaseSummarizeChatbotId || !chatbaseFostIdentificationId || !chatbaseOcodeChatbotId) {
      throw new Error('Missing Chatbase configuration in environment variables');
    }

    const credentials = { accessKeyId, secretAccessKey };

    this.s3Client = new S3Client({ region, credentials });
    this.textractClient = new TextractClient({ region, credentials });
    this.bucketName = bucketName;
    this.chatbaseApiUrl = chatbaseApiUrl;
    this.chatbaseBearerToken = chatbaseBearerToken;
    this.chatbaseSummarizeChatbotId = chatbaseSummarizeChatbotId;
    this.chatbaseFostIdentificationId = chatbaseFostIdentificationId;
    this.chatbaseOcodeChatbotId = chatbaseOcodeChatbotId;
  }

  async processAnalyze(dto: AnalyzeDto): Promise<any> {
    const isAsync = dto.async ?? true;

    // If async mode, return immediately
    if (isAsync) {
      return {
        vault_uuid: dto.vault_uuid,
        msg: 'Process start'
      };
    }

    try {
      // Step 1: Extract text from ALL documents in parallel using Textract
      console.log(`[Analyze] Starting Textract for ${dto.documents.length} document(s) in parallel...`);
      const textractResults = await Promise.all(
        dto.documents.map(async (doc) => {
          const extractedText = await this.extractTextWithTextract(doc.document_url, doc.s3_key);
          return {
            document_uuid: doc.document_uuid,
            extractedText
          };
        })
      );
      console.log(`[Analyze] Textract completed for all documents`);

      // Step 2: Send each document to Chatbase for summarization (in parallel)
      console.log(`[Analyze] Starting Chatbase summarization...`);
      const processedDocuments = await Promise.all(
        textractResults.map(async (textractResult) => {
          const chatbaseResponse = await this.callChatbase(
            textractResult.extractedText,
            'Summarize',
            this.chatbaseSummarizeChatbotId
          );

          let analysisResult = chatbaseResponse;
          if (chatbaseResponse && chatbaseResponse.text) {
            try {
              analysisResult = JSON.parse(chatbaseResponse.text);
            } catch {
              analysisResult = chatbaseResponse;
            }
          }

          // Inject document_uuid
          analysisResult.document_uuid = textractResult.document_uuid;
          return analysisResult;
        })
      );
      console.log(`[Analyze] Chatbase summarization completed`);

      // Step 3: Send all processed documents to FOST Identification
      console.log(`[Analyze] Starting FOST identification...`);
      const fostInput = { documents: processedDocuments };
      const fostResponse = await this.callChatbase(
        JSON.stringify(fostInput),
        'FOST',
        this.chatbaseFostIdentificationId
      );

      let fostsResult = fostResponse;
      if (fostResponse && fostResponse.text) {
        try {
          fostsResult = JSON.parse(fostResponse.text);
        } catch {
          fostsResult = fostResponse;
        }
      }
      console.log(`[Analyze] FOST identification completed`);

      // Step 4: Call OCODE analysis
      console.log(`[Analyze] Starting OCODE analysis...`);
      const ocodeInput = {
        fosts: fostsResult,
        documents: processedDocuments
      };
      const ocodeResponse = await this.callChatbase(
        JSON.stringify(ocodeInput),
        'OCODE',
        this.chatbaseOcodeChatbotId
      );

      let analyseResult = ocodeResponse;
      if (ocodeResponse && ocodeResponse.text) {
        try {
          analyseResult = JSON.parse(ocodeResponse.text);
        } catch {
          analyseResult = ocodeResponse;
        }
      }
      console.log(`[Analyze] OCODE analysis completed`);

      return {
        documents: processedDocuments,
        fosts: fostsResult,
        analyse: analyseResult
      };
    } catch (error) {
      console.error('[Analyze] Error:', error.message);
      throw error;
    }
  }

  private async extractTextWithTextract(documentUrl: string, existingS3Key?: string): Promise<string> {
    let tempS3Key: string | null = null;

    try {
      let s3KeyToUse: string;

      if (existingS3Key) {
        // Use existing S3 key directly
        s3KeyToUse = existingS3Key;
      } else {
        // Download from URL and upload to S3
        const response = await fetch(documentUrl);
        if (!response.ok) {
          throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
        }
        const fileBuffer = Buffer.from(await response.arrayBuffer());

        tempS3Key = `textract-temp/${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`;
        s3KeyToUse = tempS3Key;

        const putCommand = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: s3KeyToUse,
          Body: fileBuffer,
          ContentType: 'application/pdf',
        });
        await this.s3Client.send(putCommand);
      }

      // Start Textract analysis
      const startCommand = new StartDocumentAnalysisCommand({
        DocumentLocation: {
          S3Object: {
            Bucket: this.bucketName,
            Name: s3KeyToUse,
          },
        },
        FeatureTypes: ['TABLES', 'FORMS', 'LAYOUT'],
      });

      const startResponse = await this.textractClient.send(startCommand);
      const jobId = startResponse.JobId;

      if (!jobId) {
        throw new Error('Failed to start Textract job');
      }

      // Wait for completion
      const result = await this.waitForTextractCompletion(jobId);

      // Extract text from blocks
      return this.extractTextFromBlocks(result.Blocks);
    } finally {
      // Cleanup: Delete temporary S3 file only if we created one
      if (tempS3Key) {
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: tempS3Key,
          });
          await this.s3Client.send(deleteCommand);
          console.log(`[Analyze] Cleaned up temp file: ${tempS3Key}`);
        } catch (cleanupError) {
          console.warn(`[Analyze] Failed to cleanup temp file ${tempS3Key}:`, cleanupError);
        }
      }
    }
  }

  private async waitForTextractCompletion(jobId: string): Promise<any> {
    let status = 'IN_PROGRESS';
    let allBlocks: any[] = [];
    let nextToken: string | undefined;

    while (status === 'IN_PROGRESS') {
      await new Promise((resolve) => setTimeout(resolve, this.TEXTRACT_POLLING_INTERVAL));

      const getCommand = new GetDocumentAnalysisCommand({ JobId: jobId });
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

        return { JobId: jobId, JobStatus: status, Blocks: allBlocks };
      } else if (status === 'FAILED') {
        throw new Error(`Textract job ${jobId} failed`);
      }
    }
  }

  private extractTextFromBlocks(blocks: any[]): string {
    if (!blocks || blocks.length === 0) {
      return '';
    }

    const lines = blocks
      .filter((block) => block.BlockType === 'LINE')
      .map((block) => block.Text || '')
      .filter((text) => text.length > 0);

    return lines.join('\n');
  }

  private generateChatbaseMessage(data: string, chatbotId: string): any {
    const MAX_CHUNK_SIZE = 3000;

    const chunks: string[] = [];
    for (let i = 0; i < data.length; i += MAX_CHUNK_SIZE) {
      chunks.push(data.slice(i, i + MAX_CHUNK_SIZE));
    }

    const messages = [
      {
        role: 'user',
        content: `Tu vas recevoir un message en plusieurs parties.
          Ne réponds rien avant d'avoir reçu toutes les parties.
          Quand tu verras le message "FIN_DE_TRANSMISSION", tu devras :
          1. Considérer toutes les parties précédentes comme un seul document complet,
          2. Produire un unique message de sortie`,
      },
      ...chunks.map((chunk) => ({
        role: 'user',
        content: chunk,
      })),
      {
        role: 'user',
        content: 'FIN_DE_TRANSMISSION',
      },
    ];

    return {
      messages,
      chatbotId,
      stream: false,
    };
  }

  private async callChatbase(textData: string, chatbotName: string, chatbotId: string): Promise<any> {
    const requestBody = this.generateChatbaseMessage(textData, chatbotId);

    const response = await fetch(this.chatbaseApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.chatbaseBearerToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Chatbase ${chatbotName} error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
