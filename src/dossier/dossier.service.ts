import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DossierService {
  private chatbaseApiUrl: string;
  private chatbaseBearerToken: string;
  private chatbaseFostIdentificationId: string;
  private chatbaseOcodeId: string;
  private chatbaseDossierAnalysisId: string;
  private chatbaseDossierInterpretationId: string;

  constructor(private configService: ConfigService) {
    this.chatbaseApiUrl = this.configService.get<string>('CHATBASE_API_URL') || '';
    this.chatbaseBearerToken = this.configService.get<string>('CHATBASE_BEARER_TOKEN') || '';
    this.chatbaseFostIdentificationId = this.configService.get<string>('CHATBASE_FOST_IDENTIFICATION_CHATBOT_ID') || '';
    this.chatbaseOcodeId = this.configService.get<string>('CHATBASE_OCODE_CHATBOT_ID') || '';
    this.chatbaseDossierAnalysisId = this.configService.get<string>('CHATBASE_DOSSIER_ANALYSIS_CHATBOT_ID') || '';
    this.chatbaseDossierInterpretationId = this.configService.get<string>('CHATBASE_DOSSIER_INTERPRETATION_CHATBOT_ID') || '';

    if (!this.chatbaseApiUrl || !this.chatbaseBearerToken) {
      console.warn('[Dossier] Missing Chatbase configuration');
    }
  }

  async identifyFost(documents: any[]): Promise<{ fosts: any }> {
    console.log('[FOST] Identifying FOST for', documents.length, 'documents');

    try {
      const aggregatedData = {
        extraction_count: documents.length,
        extractions: documents.map(d => d.fields),
      };

      const fostResponse = await this.callChatbase(
        JSON.stringify(aggregatedData),
        this.chatbaseFostIdentificationId,
        'FOST Identification',
      );

      let fostsResult = fostResponse;
      if (fostResponse && fostResponse.text) {
        try {
          fostsResult = JSON.parse(fostResponse.text);
        } catch (error) {
          console.warn('[FOST] Could not parse response as JSON');
          fostsResult = { raw: fostResponse.text };
        }
      }

      console.log('[FOST] Identification complete');
      return { fosts: fostsResult };
    } catch (error) {
      console.error('[FOST Error]:', error);
      throw error;
    }
  }

  async analyzeFileOcode(fields: any, fost: any): Promise<{ ocode: any }> {
    console.log('[OCODE] Analyzing file with FOST');

    try {
      const data = {
        fields: fields,
        fost: fost,
      };

      const ocodeResponse = await this.callChatbase(
        JSON.stringify(data),
        this.chatbaseOcodeId,
        'OCODE Analysis',
      );

      let ocodeResult = ocodeResponse;
      if (ocodeResponse && ocodeResponse.text) {
        try {
          ocodeResult = JSON.parse(ocodeResponse.text);
        } catch (error) {
          console.warn('[OCODE] Could not parse response as JSON');
          ocodeResult = { raw: ocodeResponse.text };
        }
      }

      console.log('[OCODE] Analysis complete');
      return { ocode: ocodeResult };
    } catch (error) {
      console.error('[OCODE Error]:', error);
      throw error;
    }
  }

  async analyzeDossier(documents: any[], fosts: any): Promise<{ analyse: any }> {
    console.log('[Analyse] Starting Dossier Analysis');

    try {
      const aggregatedData = {
        extraction_count: documents.length,
        extractions: documents.map(d => d.fields),
      };

      let fostsArray: any[] = [];
      if (Array.isArray(fosts)) {
        fostsArray = fosts;
      } else if (fosts) {
        fostsArray = [fosts];
      }

      const enhancedData = {
        ...aggregatedData,
        fosts: fostsArray,
      };

      const analysisResponse = await this.callChatbase(
        JSON.stringify(enhancedData),
        this.chatbaseDossierAnalysisId,
        'Dossier Analysis',
      );

      let analyseResult = analysisResponse;
      if (analysisResponse && analysisResponse.text) {
        try {
          analyseResult = JSON.parse(analysisResponse.text);
        } catch (error) {
          console.warn('[Analyse] Could not parse response as JSON');
          analyseResult = { raw: analysisResponse.text };
        }
      }

      console.log('[Analyse] Analysis complete');
      return { analyse: analyseResult };
    } catch (error) {
      console.error('[Analyse Error]:', error);
      throw error;
    }
  }

  async interpretDossier(analyse: any): Promise<{ interpretation: any }> {
    console.log('[Interpretation] Starting Dossier Interpretation');

    try {
      const interpretResponse = await this.callChatbase(
        JSON.stringify(analyse),
        this.chatbaseDossierInterpretationId,
        'Dossier Interpretation',
      );

      let interpretResult = interpretResponse;
      if (interpretResponse && interpretResponse.text) {
        interpretResult = interpretResponse.text;
      }

      console.log('[Interpretation] Complete');
      return { interpretation: interpretResult };
    } catch (error) {
      console.error('[Interpretation Error]:', error);
      throw error;
    }
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

    console.log(`[Dossier] Sending ${chunks.length} chunk(s) (${data.length} total characters)`);

    return {
      messages: messages,
      chatbotId: chatbotId,
      stream: false,
    };
  }

  private async callChatbase(textData: string, chatbotId: string, chatbotName: string): Promise<any> {
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
