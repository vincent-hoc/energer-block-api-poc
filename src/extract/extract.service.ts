import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExtractService {
  private chatbaseApiUrl: string;
  private chatbaseBearerToken: string;
  private chatbaseFieldExtractionId: string;

  constructor(private configService: ConfigService) {
    this.chatbaseApiUrl = this.configService.get<string>('CHATBASE_API_URL') || '';
    this.chatbaseBearerToken = this.configService.get<string>('CHATBASE_BEARER_TOKEN') || '';
    this.chatbaseFieldExtractionId = this.configService.get<string>('CHATBASE_FIELD_EXTRACTION_CHATBOT_ID') || '';

    if (!this.chatbaseApiUrl || !this.chatbaseBearerToken || !this.chatbaseFieldExtractionId) {
      console.warn('[Extract] Missing Chatbase configuration');
    }
  }

  async extractFieldsWithChatbase(ocrText: string, documentUuid: string): Promise<{ document_uuid: string; fields: any; status: string }> {
    try {
      console.log(`[Extract] Starting field extraction for ${documentUuid}`);

      const requestBody = this.generateChatbaseMessage(ocrText, this.chatbaseFieldExtractionId);

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

      // Parse the response text as JSON if possible
      let fields = result;
      if (result && result.text) {
        try {
          fields = JSON.parse(result.text);
        } catch (e) {
          // If parsing fails, use raw text
          fields = { raw: result.text };
        }
      }

      console.log(`[Extract] Field extraction completed for ${documentUuid}`);

      return {
        document_uuid: documentUuid,
        fields: fields,
        status: 'completed',
      };
    } catch (error) {
      console.error(`[Extract Error] Failed to extract fields for ${documentUuid}:`, error);
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

    console.log(`[Extract] Sending ${chunks.length} chunk(s) (${data.length} total characters)`);

    return {
      messages: messages,
      chatbotId: chatbotId,
      stream: false,
    };
  }
}
