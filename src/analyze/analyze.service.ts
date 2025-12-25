import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnalyzeDto } from './analyze.dto';
import { ocrSpace } from 'ocr-space-api-wrapper';

@Injectable()
export class AnalyzeService {
  private ocrApiKey: string;
  private ocrUrl: string;
  private chatbaseApiUrl: string;
  private chatbaseBearerToken: string;
  private chatbaseSummarizeChatbotId: string;
  private chatbaseFostIdentificationId: string;
  private chatbaseOcodeChatbotId: string;

  constructor(private configService: ConfigService) {
    const ocrApiKey = this.configService.get<string>('OCR_SPACE_API_KEY');
    const ocrUrl = this.configService.get<string>('OCR_SPACE_URL');
    const chatbaseApiUrl = this.configService.get<string>('CHATBASE_API_URL');
    const chatbaseBearerToken = this.configService.get<string>('CHATBASE_BEARER_TOKEN');
    const chatbaseSummarizeChatbotId = this.configService.get<string>('CHATBASE_SUMMARIZE_CHATBOT_ID');
    const chatbaseFostIdentificationId = this.configService.get<string>('CHATBASE_FOST_IDENTIFICATION_CHATBOT_ID');
    const chatbaseOcodeChatbotId = this.configService.get<string>('CHATBASE_OCODE_CHATBOT_ID');

    if (!ocrApiKey || !ocrUrl) {
      throw new Error('Missing OCR.space configuration in environment variables');
    }

    if (!chatbaseApiUrl || !chatbaseBearerToken || !chatbaseSummarizeChatbotId || !chatbaseFostIdentificationId || !chatbaseOcodeChatbotId) {
      throw new Error('Missing Chatbase configuration in environment variables');
    }

    this.ocrApiKey = ocrApiKey;
    this.ocrUrl = ocrUrl;
    this.chatbaseApiUrl = chatbaseApiUrl;
    this.chatbaseBearerToken = chatbaseBearerToken;
    this.chatbaseSummarizeChatbotId = chatbaseSummarizeChatbotId;
    this.chatbaseFostIdentificationId = chatbaseFostIdentificationId;
    this.chatbaseOcodeChatbotId = chatbaseOcodeChatbotId;
  }

  async processAnalyze(dto: AnalyzeDto): Promise<any> {
    console.log('Processing analyze request:', {
      vault_uuid: dto.vault_uuid,
      documents_count: dto.documents.length,
      async: dto.async ?? true,
    });

    const isAsync = dto.async ?? true;

    // If async mode, return immediately
    if (isAsync) {
      console.log('[Async Mode] Returning immediately with process start message');
      return {
        vault_uuid: dto.vault_uuid,
        msg: 'Process start'
      };
    }

    try {
      const processedDocuments: any[] = [];

      // Process each document
      for (let i = 0; i < dto.documents.length; i++) {
        const doc = dto.documents[i];
        console.log(`\n=== Processing document ${i + 1}/${dto.documents.length} ===`);
        console.log(`Document UUID: ${doc.document_uuid}`);

        // Step 1: Extract text with OCR.space
        console.log('[Step 1] Starting OCR.space text extraction...');
        const extractedText = await this.extractTextWithOCR(doc.document_url);
        console.log(`[Step 1 - OCR.space] Completed - Extracted ${extractedText.length} characters`);

        // Step 2: Send to Chatbase for analysis
        console.log('[Step 2] Sending OCR text to Chatbase (Summarize)...');
        const chatbaseResponse = await this.callChatbase(extractedText, 'Summarize Analysis', this.chatbaseSummarizeChatbotId);
        console.log('[Step 2 - Chatbase] Completed');

        // Parse response if it has a "text" field
        let analysisResult = chatbaseResponse;
        if (chatbaseResponse && chatbaseResponse.text) {
          try {
            analysisResult = JSON.parse(chatbaseResponse.text);
            console.log('[Step 2] Analysis result parsed');
          } catch (error) {
            console.warn('[Warning] Could not parse Chatbase text field as JSON, using raw response');
            analysisResult = chatbaseResponse;
          }
        }

        // Inject document_uuid into analysisResult
        analysisResult.document_uuid = doc.document_uuid;
        console.log('[Step 2] Injected document_uuid:', doc.document_uuid);

        processedDocuments.push(analysisResult);
      }

      // Step 3: Send all processed documents to FOST Identification
      console.log('\n[Step 3] Sending all documents to FOST Identification...');
      const fostInput = { documents: processedDocuments };
      const fostResponse = await this.callChatbase(JSON.stringify(fostInput), 'FOST Identification', this.chatbaseFostIdentificationId);
      console.log('[Step 3 - FOST] Completed');

      // Parse FOST response
      let fostsResult = fostResponse;
      if (fostResponse && fostResponse.text) {
        try {
          fostsResult = JSON.parse(fostResponse.text);
          console.log('[Step 3] FOST result parsed');
        } catch (error) {
          console.warn('[Warning] Could not parse FOST text field as JSON, using raw response');
          fostsResult = fostResponse;
        }
      }

      // Step 4: Call OCODE analysis (async is always false here due to early return)
      console.log('\n[Step 4] Sending documents and fosts to OCODE chatbot...');
      const ocodeInput = {
        fosts: fostsResult,
        documents: processedDocuments
      };
      const ocodeResponse = await this.callChatbase(JSON.stringify(ocodeInput), 'OCODE Analysis', this.chatbaseOcodeChatbotId);
      console.log('[Step 4 - OCODE] Completed');

      // Parse OCODE response
      let analyseResult = ocodeResponse;
      if (ocodeResponse && ocodeResponse.text) {
        try {
          analyseResult = JSON.parse(ocodeResponse.text);
          console.log('[Step 4] OCODE analysis result parsed');
        } catch (error) {
          console.warn('[Warning] Could not parse OCODE text field as JSON, using raw response');
          analyseResult = ocodeResponse;
        }
      }

      return {
        documents: processedDocuments,
        fosts: fostsResult,
        analyse: analyseResult
      };
    } catch (error) {
      console.error('[Error] Failed to process analyze:', error);
      throw error;
    }
  }

  private async extractTextWithOCR(documentUrl: string): Promise<string> {
    try {
      console.log('  Sending file URL to OCR.space...');

      const ocrResult = await ocrSpace(documentUrl, {
        apiKey: this.ocrApiKey,
        language: 'fre',
        OCREngine: "1",
        isTable: false,
        isSearchablePdfHideTextLayer: true,
        scale: true,
        filetype: 'PDF',
        ocrUrl: this.ocrUrl,
      });

      // Extract text from OCR result
      if (ocrResult && ocrResult.ParsedResults) {
        const allText = ocrResult.ParsedResults.map(
          (result: any) => result.ParsedText || '',
        ).join('\n');

        return allText;
      }

      throw new Error('No text extracted from OCR.space');
    } catch (error) {
      console.error('[OCR Error] Failed to extract text:', error);
      throw error;
    }
  }

  private generateChatbaseMessage(data: string, chatbotId: string): any {
    const MAX_CHUNK_SIZE = 3000;

    // Split text into chunks
    const chunks: string[] = [];
    for (let i = 0; i < data.length; i += MAX_CHUNK_SIZE) {
      chunks.push(data.slice(i, i + MAX_CHUNK_SIZE));
    }

    // Build messages array
    const messages = [
      {
        role: 'user',
        content: `
          Tu vas recevoir un message en plusieurs parties.
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

    console.log(
      `  Sending ${chunks.length} chunk(s) (${data.length} total characters)`,
    );

    return {
      messages: messages,
      chatbotId: chatbotId,
      stream: false,
    };
  }

  private async callChatbase(textData: string, chatbotName: string, chatbotId: string): Promise<any> {
    try {
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
        throw new Error(`Chatbase API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`[Chatbase ${chatbotName} Error]:`, error);
      throw error;
    }
  }
}
