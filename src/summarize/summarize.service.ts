import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SummarizeDto, OcrDto, AnalyzeTextDto, FostDto, OcodeDto } from './summarize.dto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} from '@aws-sdk/client-textract';

@Injectable()
export class SummarizeService {
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

  async processSummarize(dto: SummarizeDto): Promise<any> {
    const isAsync = dto.async ?? true;

    try {
      // Step 1: Extract text with AWS Textract
      console.log('[Summarize] Starting Textract...');
      const textractResult = await this.extractTextWithTextract(dto.document_url, dto.s3_key, dto.debug ?? false);
      const extractedText = textractResult.text;
      console.log('[Summarize] Textract completed');

      // Step 2: Send to Chatbase for analysis
      console.log('[Summarize] Starting Chatbase summarization...');
      const chatbaseResponse = await this.callChatbase(extractedText, 'Summarize', this.chatbaseSummarizeChatbotId);

      let analysisResult = this.parseChatbaseResponse(chatbaseResponse);

      if (dto.document_uuid) {
        analysisResult.document_uuid = dto.document_uuid;
      }
      console.log('[Summarize] Chatbase summarization completed');

      // Step 3: Send analysis result to FOST identification
      console.log('[Summarize] Starting FOST identification...');
      const fostResponse = await this.callChatbase(JSON.stringify(analysisResult), 'FOST', this.chatbaseFostIdentificationId);

      const finalResult = this.parseChatbaseResponse(fostResponse);
      console.log('[Summarize] FOST identification completed');

      const fostsValue = dto.fost_key ? [dto.fost_key] : finalResult;

      // Step 4: Only call OCODE analysis if async is false
      let analyseResult = [];

      if (!isAsync) {
        console.log('[Summarize] Starting OCODE analysis...');
        const ocodeInput = {
          fosts: fostsValue,
          documents: [analysisResult]
        };
        const ocodeResponse = await this.callChatbase(JSON.stringify(ocodeInput), 'OCODE', this.chatbaseOcodeChatbotId);

        analyseResult = this.parseChatbaseResponse(ocodeResponse);
        console.log('[Summarize] OCODE analysis completed');
      }

      const response: any = {
        documents: [analysisResult],
        fosts: fostsValue,
        analyse: analyseResult
      };

      if (dto.debug) {
        response.debug_OCR = extractedText;
        response.debug_OCR_JSON = textractResult.blocks;
      }

      return response;
    } catch (error) {
      console.error('[Summarize] Error:', error.message);
      throw error;
    }
  }

  // Step 1: OCR with Textract
  async processOcr(dto: OcrDto): Promise<{ extracted_text: string; blocks?: any[] }> {
    console.log('[Summarize] Step 1: Starting OCR...');
    const result = await this.extractTextWithTextract('', dto.s3_key, dto.debug ?? false);
    console.log('[Summarize] Step 1: OCR completed');

    const response: { extracted_text: string; blocks?: any[] } = {
      extracted_text: result.text
    };

    if (dto.debug) {
      response.blocks = result.blocks;
    }

    return response;
  }

  // Step 2: Analyze text with Chatbase
  async processAnalyzeText(dto: AnalyzeTextDto): Promise<any> {
    console.log('[Summarize] Step 2: Starting text analysis...');
    const chatbaseResponse = await this.callChatbase(dto.extracted_text, 'Summarize', this.chatbaseSummarizeChatbotId);

    let analysisResult = this.parseChatbaseResponse(chatbaseResponse);

    if (dto.document_uuid) {
      analysisResult.document_uuid = dto.document_uuid;
    }

    console.log('[Summarize] Step 2: Text analysis completed');
    return analysisResult;
  }

  // Step 3: FOST identification
  async processFost(dto: FostDto): Promise<any> {
    console.log('[Summarize] Step 3: Starting FOST identification...');
    const fostResponse = await this.callChatbase(JSON.stringify(dto.analysis_result), 'FOST', this.chatbaseFostIdentificationId);

    const result = this.parseChatbaseResponse(fostResponse);

    console.log('[Summarize] Step 3: FOST identification completed');
    return result;
  }

  // Step 4: OCODE analysis
  async processOcode(dto: OcodeDto): Promise<any> {
    console.log('[Summarize] Step 4: Starting OCODE analysis...');
    const ocodeInput = {
      fosts: dto.fosts,
      documents: dto.documents
    };

    const ocodeResponse = await this.callChatbase(JSON.stringify(ocodeInput), 'OCODE', this.chatbaseOcodeChatbotId);

    const result = this.parseChatbaseResponse(ocodeResponse);

    console.log('[Summarize] Step 4: OCODE analysis completed');
    return result;
  }

  private async extractTextWithTextract(documentUrl: string, existingS3Key: string | undefined, debug: boolean): Promise<{ text: string; blocks: any[] }> {
    let tempS3Key: string | null = null;

    try {
      let s3KeyToUse: string;

      if (existingS3Key) {
        s3KeyToUse = existingS3Key;
      } else {
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

      const result = await this.waitForTextractCompletion(jobId);
      return { text: this.extractTextFromBlocks(result.Blocks), blocks: result.Blocks };
    } finally {
      if (tempS3Key) {
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: tempS3Key,
          });
          await this.s3Client.send(deleteCommand);
          console.log(`[Summarize] Cleaned up temp file: ${tempS3Key}`);
        } catch (cleanupError) {
          console.warn(`[Summarize] Failed to cleanup temp file ${tempS3Key}:`, cleanupError);
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

  /**
   * Parse Chatbase response, handling various formats:
   * - Direct JSON object
   * - Object with 'text' field containing JSON string
   * - Object with 'text' field containing JSON wrapped in markdown code blocks
   */
  private parseChatbaseResponse(chatbaseResponse: any): any {
    if (!chatbaseResponse) {
      return chatbaseResponse;
    }

    // If response has a 'text' field, try to parse it
    if (chatbaseResponse.text) {
      let textContent = chatbaseResponse.text;

      // Remove markdown code block delimiters if present
      // Handles: ```json\n{...}\n``` or ```\n{...}\n```
      const codeBlockRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/;
      const match = textContent.match(codeBlockRegex);
      if (match) {
        textContent = match[1].trim();
      }

      // Try to parse as JSON
      try {
        return JSON.parse(textContent);
      } catch {
        // If parsing fails, return the original response
        console.warn('[Chatbase] Could not parse response text as JSON');
        return chatbaseResponse;
      }
    }

    return chatbaseResponse;
  }
}
