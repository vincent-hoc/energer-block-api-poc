import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} from '@aws-sdk/client-textract';
import { ocrSpace } from 'ocr-space-api-wrapper';
import OpenAI from 'openai';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs/promises';
import * as path from 'path';
import { BatchDto } from '../dto/batch.dto';

@Injectable()
export class BatchService {
  private s3Client: S3Client;
  private textractClient: TextractClient;
  private openai: OpenAI;
  private bucketName: string;
  private ocrApiKey: string;
  private ocrUrl: string;
  private chatbaseApiUrl: string;
  private chatbaseBearerToken: string;
  private chatbaseFieldExtractionId: string;
  private chatbaseFostIdentificationId: string;
  private chatbaseDossierAnalysisId: string;
  private chatbaseDossierInterpretationId: string;

  private readonly MAX_RETRIES = 20;
  private readonly INITIAL_RETRY_DELAY = 5000; // 5 seconds
  private readonly TEXTRACT_POLLING_INTERVAL = 10000; // 10 seconds between status checks

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    const ocrApiKey = this.configService.get<string>('OCR_SPACE_API_KEY');
    const ocrUrl = this.configService.get<string>('OCR_SPACE_URL');
    const chatbaseApiUrl = this.configService.get<string>('CHATBASE_API_URL');
    const chatbaseBearerToken = this.configService.get<string>('CHATBASE_BEARER_TOKEN');
    const chatbaseFieldExtractionId = this.configService.get<string>('CHATBASE_FIELD_EXTRACTION_CHATBOT_ID');
    const chatbaseFostIdentificationId = this.configService.get<string>('CHATBASE_FOST_IDENTIFICATION_CHATBOT_ID');
    const chatbaseDossierAnalysisId = this.configService.get<string>('CHATBASE_DOSSIER_ANALYSIS_CHATBOT_ID');
    const chatbaseDossierInterpretationId = this.configService.get<string>('CHATBASE_DOSSIER_INTERPRETATION_CHATBOT_ID');

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('Missing AWS configuration in environment variables');
    }

    if (!openaiApiKey) {
      throw new Error('Missing OpenAI API key in environment variables');
    }

    if (!ocrApiKey || !ocrUrl) {
      throw new Error('Missing OCR.space configuration in environment variables');
    }

    if (!chatbaseApiUrl || !chatbaseBearerToken ||
        !chatbaseFieldExtractionId || !chatbaseFostIdentificationId ||
        !chatbaseDossierAnalysisId || !chatbaseDossierInterpretationId) {
      throw new Error('Missing Chatbase configuration in environment variables');
    }

    const credentials = {
      accessKeyId,
      secretAccessKey,
    };

    this.s3Client = new S3Client({
      region,
      credentials,
    });

    this.textractClient = new TextractClient({
      region,
      credentials,
    });

    this.openai = new OpenAI({
      apiKey: openaiApiKey,
      timeout: 120000, // 2 minutes timeout for large documents
      maxRetries: 0, // Disable OpenAI's internal retries (we handle retries ourselves)
    });

    this.bucketName = bucketName;
    this.ocrApiKey = ocrApiKey;
    this.ocrUrl = ocrUrl;
    this.chatbaseApiUrl = chatbaseApiUrl;
    this.chatbaseBearerToken = chatbaseBearerToken;
    this.chatbaseFieldExtractionId = chatbaseFieldExtractionId;
    this.chatbaseFostIdentificationId = chatbaseFostIdentificationId;
    this.chatbaseDossierAnalysisId = chatbaseDossierAnalysisId;
    this.chatbaseDossierInterpretationId = chatbaseDossierInterpretationId;
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    stepName: string,
    attempt: number = 1,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= this.MAX_RETRIES) {
        console.error(`      [${stepName}] Max retries (${this.MAX_RETRIES}) reached. Giving up.`);
        throw error;
      }

      const delay = this.INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
      const errorMessage = error instanceof Error ? error.message : String(error);

      console.warn(`      [${stepName}] Error on attempt ${attempt}/${this.MAX_RETRIES}: ${errorMessage}`);
      console.log(`      [${stepName}] Retrying in ${(delay / 1000).toFixed(1)}s...`);

      await new Promise((resolve) => setTimeout(resolve, delay));

      return this.retryWithBackoff(operation, stepName, attempt + 1);
    }
  }

  async processBatch(batchDto: BatchDto): Promise<any> {
    const allPdfFiles = await this.listPdfFiles(batchDto.folder);

    console.log('PDF files found in S3:');
    console.log(JSON.stringify(allPdfFiles, null, 2));
    console.log(`Total files in folder: ${allPdfFiles.length}`);

    const startIndex = batchDto.startIndex ?? 0;
    const fileCount = batchDto.fileCount ?? allPdfFiles.length;
    const debug = batchDto.debug ?? false;
    const maxParallel = batchDto.maxParallelProcessing ??
      this.configService.get<number>('MAX_PARALLEL_PROCESSING') ?? 3;

    const endIndex = Math.min(startIndex + fileCount, allPdfFiles.length);
    const pdfFiles = allPdfFiles.slice(startIndex, endIndex);

    console.log(
      `\nProcessing range: files ${startIndex} to ${endIndex - 1} (${pdfFiles.length} files)`,
    );
    console.log(`Debug mode: ${debug ? 'ENABLED (keeping all files)' : 'DISABLED (cleanup enabled)'}`);
    console.log(`Max parallel processing: ${maxParallel} ${batchDto.maxParallelProcessing ? '(from API parameter)' : '(from .env)'}`);

    if (pdfFiles.length === 0) {
      console.log('No files to process in the specified range.');
      return {
        message: 'No files to process',
        timestamp: new Date().toISOString(),
      };
    }

    console.log(`\n=== Starting batch processing (max ${maxParallel} parallel) ===\n`);

    const batchStartTime = Date.now();
    const fileResults = await this.processFilesInParallel(pdfFiles, maxParallel, debug);
    const batchDuration = (Date.now() - batchStartTime) / 1000;

    console.log('\n=== Batch processing completed ===\n');

    // Generate global batch report
    const batchReport = this.generateBatchReport(fileResults, batchDuration, {
      startIndex,
      endIndex,
      maxParallel,
      debug,
    });

    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    const reportPath = path.join(tempDir, 'batch_report.txt');
    await fs.writeFile(reportPath, batchReport, 'utf-8');

    console.log(`\n📊 Global batch report saved: temp/batch_report.txt\n`);

    return {
      message: 'Batch processing completed',
      timestamp: new Date().toISOString(),
      debug,
      filesProcessed: fileResults.length,
      filesSuccess: fileResults.filter(r => r.success).length,
      filesFailed: fileResults.filter(r => !r.success).length,
      totalDuration: batchDuration,
      reportPath: 'temp/batch_report.txt',
    };
  }

  private async processFilesInParallel(
    files: string[],
    maxParallel: number,
    debug: boolean,
  ): Promise<Array<{ file: string; duration: number; success: boolean; error?: string }>> {
    const results: Promise<{ file: string; duration: number; success: boolean; error?: string }>[] = [];
    let index = 0;
    let activeWorkers = 0;
    let completed = 0;

    return new Promise((resolve, reject) => {
      const startNext = () => {
        while (activeWorkers < maxParallel && index < files.length) {
          const currentIndex = index;
          const file = files[index];
          index++;
          activeWorkers++;

          console.log(
            `[Worker ${activeWorkers}] Starting file ${currentIndex + 1}/${files.length}: ${file}`,
          );

          const fileStartTime = Date.now();
          const promise = this.processFile(file, currentIndex + 1, files.length, debug)
            .then(() => {
              completed++;
              activeWorkers--;
              const duration = (Date.now() - fileStartTime) / 1000;
              console.log(
                `[Completed ${completed}/${files.length}] Finished: ${file}`,
              );
              startNext();
              return { file, duration, success: true };
            })
            .catch((error) => {
              activeWorkers--;
              const duration = (Date.now() - fileStartTime) / 1000;
              const errorMessage = error instanceof Error ? error.message : String(error);
              console.error(`[Error] Failed to process ${file}:`, error);
              startNext();
              return { file, duration, success: false, error: errorMessage };
            });

          results.push(promise);
        }

        if (activeWorkers === 0 && index >= files.length) {
          Promise.all(results)
            .then((fileResults) => resolve(fileResults))
            .catch(reject);
        }
      };

      startNext();
    });
  }

  private async processFile(
    fileKey: string,
    current: number,
    total: number,
    debug: boolean,
  ): Promise<void> {
    console.log(`  - Processing ${current}/${total}: ${fileKey}`);
    const fileStartTime = Date.now();

    try {
      // Create dedicated folder for this file
      const originalFilename = path.basename(fileKey, '.pdf');
      const fileFolder = path.join(process.cwd(), 'temp', originalFilename);
      await fs.mkdir(fileFolder, { recursive: true });
      console.log(`    Created folder: ${originalFilename}/`);

      // Step 1: Extract text with OCR.space
      console.log(`    [Step 1] Starting OCR.space text extraction...`);
      const ocrStartTime = Date.now();

      const extractedText = await this.retryWithBackoff(
        () => this.extractTextWithOCR(fileKey),
        'OCR Extraction',
      );

      const ocrDuration = ((Date.now() - ocrStartTime) / 1000).toFixed(2);
      console.log(
        `    [Step 1 - OCR.space] Completed in ${ocrDuration}s - Extracted ${extractedText.length} characters`,
      );

      // Save OCR result to file
      const ocrFilename = `1_ocr_extraction.txt`;
      const ocrPath = path.join(fileFolder, ocrFilename);
      await fs.writeFile(ocrPath, extractedText, 'utf-8');
      console.log(`      Saved OCR result: ${ocrFilename}`);

      // Step 2: Analyze extracted text with OpenAI
      console.log(`    [Step 2] Starting OpenAI analysis...`);
      const openaiStartTime = Date.now();
      const analysisResult = await this.retryWithBackoff(
        () => this.analyzeWithOpenAI(extractedText),
        'OpenAI Analysis',
      );
      const openaiDuration = ((Date.now() - openaiStartTime) / 1000).toFixed(2);

      console.log(
        `    [Step 2 - OpenAI] Completed in ${openaiDuration}s - Documents detected: ${analysisResult.documents?.length || 0}`,
      );

      // Save OpenAI analysis result to file
      const openaiFilename = `2_openai_analysis.json`;
      const openaiPath = path.join(fileFolder, openaiFilename);
      await fs.writeFile(openaiPath, JSON.stringify(analysisResult, null, 2), 'utf-8');
      console.log(`      Saved OpenAI analysis: ${openaiFilename}`);

      if (analysisResult.documents && analysisResult.documents.length > 0) {
        analysisResult.documents.forEach((doc: any, index: number) => {
          console.log(
            `      [Document ${index + 1}] Type: ${doc.type_fichier}, Pages: ${doc.page_debut}-${doc.page_fin}`,
          );
        });

        // Step 3: Generate separate PDFs for each document
        console.log(`    [Step 3] Generating separate PDFs...`);
        const pdfStartTime = Date.now();

        const generatedPdfs = await this.generateSeparatePdfs(
          fileKey,
          analysisResult.documents,
          fileFolder,
        );

        const pdfDuration = ((Date.now() - pdfStartTime) / 1000).toFixed(2);
        console.log(
          `    [Step 3 - PDF Generation] Completed in ${pdfDuration}s - Generated ${generatedPdfs.length} PDF(s)`,
        );

        generatedPdfs.forEach((pdfInfo, index) => {
          console.log(`      [PDF ${index + 1}] ${pdfInfo.pdfPath}`);
        });

        // Step 4: Analyze each PDF with Textract in parallel
        console.log(`    [Step 4] Analyzing PDFs with Textract...`);
        const textractStartTime = Date.now();

        const textractResults = await this.analyzeWithTextract(generatedPdfs, fileFolder);

        const textractDuration = ((Date.now() - textractStartTime) / 1000).toFixed(2);
        console.log(
          `    [Step 4 - Textract] Completed in ${textractDuration}s - Analyzed ${textractResults.length} PDF(s)`,
        );

        textractResults.forEach((result, index) => {
          console.log(`      [JSON ${index + 1}] ${result}`);
        });

        // Step 5: Extract fields with Chatbase
        console.log(`    [Step 5] Extracting fields with Chatbase...`);
        const chatbaseStartTime = Date.now();

        const chatbaseResults = await this.extractFieldsWithChatbase(textractResults, fileFolder);

        const chatbaseDuration = ((Date.now() - chatbaseStartTime) / 1000).toFixed(2);
        console.log(
          `    [Step 5 - Chatbase] Completed in ${chatbaseDuration}s - Processed ${chatbaseResults.length} document(s)`,
        );

        chatbaseResults.forEach((result, index) => {
          console.log(`      [Chatbase ${index + 1}] ${result}`);
        });

        // Step 6: Aggregate field extractions and send to FOST Identification
        console.log(`    [Step 6] Aggregating extractions and calling FOST Identification...`);
        const fostStartTime = Date.now();

        const { fostResultPath, aggregatedPath } = await this.processFostIdentification(chatbaseResults, fileFolder);

        const fostDuration = ((Date.now() - fostStartTime) / 1000).toFixed(2);
        console.log(
          `    [Step 6 - FOST Identification] Completed in ${fostDuration}s`,
        );
        console.log(`      [FOST Result] ${fostResultPath}`);

        // Step 7: Enrich with Textract texts and send to Dossier Analysis
        console.log(`    [Step 7] Processing Dossier Analysis...`);
        const analysisStartTime = Date.now();

        const dossierAnalysisResult = await this.processDossierAnalysis(
          aggregatedPath,
          fostResultPath,
          fileFolder,
        );

        const analysisDuration = ((Date.now() - analysisStartTime) / 1000).toFixed(2);
        console.log(
          `    [Step 7 - Dossier Analysis] Completed in ${analysisDuration}s`,
        );
        console.log(`      [Analysis Result] ${dossierAnalysisResult}`);

        // Step 8: Send to Dossier Interpretation and generate report
        console.log(`    [Step 8] Generating interpretation report...`);
        const interpretationStartTime = Date.now();

        const reportPath = await this.processDossierInterpretation(
          dossierAnalysisResult,
          fileFolder,
        );

        const interpretationDuration = ((Date.now() - interpretationStartTime) / 1000).toFixed(2);
        console.log(
          `    [Step 8 - Dossier Interpretation] Completed in ${interpretationDuration}s`,
        );
        console.log(`      [Report] ${reportPath}`);

        // Step 9: Send dossier_analysis to Interprétation du dossier and generate text report
        console.log(`    [Step 9] Generating final interpretation text...`);
        const finalInterpretationStartTime = Date.now();

        const finalReportPath = await this.generateFinalInterpretation(
          dossierAnalysisResult,
          fileFolder,
        );

        const finalInterpretationDuration = ((Date.now() - finalInterpretationStartTime) / 1000).toFixed(2);
        console.log(
          `    [Step 9 - Final Interpretation] Completed in ${finalInterpretationDuration}s`,
        );
        console.log(`      [Final Report] ${finalReportPath}`);

        // Generate execution report
        const executionReport = this.generateExecutionReport({
          ocrDuration,
          openaiDuration,
          pdfDuration,
          textractDuration,
          chatbaseDuration,
          fostDuration,
          analysisDuration,
          interpretationDuration,
          finalInterpretationDuration,
          totalDuration: ((Date.now() - fileStartTime) / 1000).toFixed(2),
          fileKey,
          documentsCount: analysisResult.documents?.length || 0,
        });

        const executionReportFilename = `99-execution_report.txt`;
        const executionReportPath = path.join(fileFolder, executionReportFilename);
        await fs.writeFile(executionReportPath, executionReport, 'utf-8');
        console.log(`    [Execution Report] Saved: ${executionReportFilename}`);

        // Cleanup temporary files if debug mode is disabled
        if (!debug) {
          console.log(`    [Cleanup] Removing temporary files (keeping only 9_interpretation_finale.txt)...`);
          const files = await fs.readdir(fileFolder);
          let deletedCount = 0;

          for (const file of files) {
            if (file !== '9_interpretation_finale.txt') {
              const filePath = path.join(fileFolder, file);
              await fs.unlink(filePath);
              deletedCount++;
            }
          }

          console.log(`    [Cleanup] Removed ${deletedCount} temporary file(s)`);
        } else {
          console.log(`    [Debug Mode] Keeping all ${analysisResult.documents?.length || 0} temporary files`);
        }
      }

      const totalDuration = ((Date.now() - fileStartTime) / 1000).toFixed(2);
      console.log(
        `  - Completed ${current}/${total}: ${fileKey} in ${totalDuration}s\n`,
      );
    } catch (error) {
      console.error(`    [Error] Failed to process ${fileKey}:`, error);
      throw error;
    }
  }

  private async extractTextWithOCR(fileKey: string): Promise<string> {
    try {
      // Generate signed URL for S3 file
      console.log(`      Generating signed URL from S3...`);
      const getObjectCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const signedUrl = await getSignedUrl(this.s3Client, getObjectCommand, {
        expiresIn: 3600, // URL expires in 1 hour
      });

      // Send to OCR.space
      console.log(`      Sending file URL to OCR.space...`);
      const ocrResult = await ocrSpace(signedUrl, {
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
      console.error(`      [OCR Error] Failed to extract text:`, error);
      throw error;
    }
  }

  private async analyzeWithOpenAI(extractedText: string): Promise<any> {
    const systemMessage = `Tu es un assistant spécialisé dans l'analyse de texte issu d'OCR. Tu reçois en ENTRÉE :
- Le texte brut d'un document OCR multi-pages.
- Ce texte peut contenir PLUSIEURS DOCUMENTS successifs (factures, devis, etc.).
- Le texte contient des informations de pagination (numéros de pages, séparateurs, ou structure permettant de reconstituer la position des pages).

TON OBJECTIF :
Identifier chaque document complet présent dans le texte, puis renvoyer un UNIQUE objet JSON décrivant tous les documents détectés.

CONTRAINTES DE SORTIE (TRÈS IMPORTANT) :
1. Tu dois renvoyer **UNIQUEMENT** du JSON valide, sans texte avant ou après.
2. Le JSON doit respecter STRICTEMENT le schéma suivant :
{
  "documents": [
    {
      "type_fichier": "string",
      "nb_pages": 0,
      "page_debut": 0,
      "page_fin": 0,
      "contenu": "string"
    }
  ]
}

- "type_fichier" : type du document détecté, par exemple :
  - "Facture"
  - "Devis"
  - "Bon de commande"
  - "Attestation"
  - ou toute autre valeur pertinente ("Autre", "Contrat", etc.) si nécessaire.
- "nb_pages" : nombre total de pages pour ce document.
- "page_debut" : numéro de page (entier) de début du document dans le PDF COMPLET (la première page du PDF complet est 1).
- "page_fin" : numéro de page (entier) de fin du document dans le PDF COMPLET.
- Tu dois respecter : nb_pages = page_fin - page_debut + 1
- "contenu" : texte complet du document, correspondant à l'ensemble des pages de ce document :
  - concatène les pages dans l'ordre,
  - conserve les sauts de ligne autant que possible,
  - n'ajoute pas de commentaire ou de texte généré, uniquement le texte OCR (éventuellement réorganisé, mais sans interprétation).

DÉLIMITATION DES DOCUMENTS :
- Considère qu'un NOUVEAU document commence lorsqu'au moins un des signaux suivants apparaît :
  - Un nouveau titre clair de type : "FACTURE", "DEVIS", "BON DE COMMANDE", "ATTESTATION", etc.
  - Un changement net de bloc d'en-tête (nouvelle raison sociale, nouvelles coordonnées, nouveau logo ou bloc d'adresse).
  - Une nouvelle numérotation de type : "Page 1/..." ou un style de numérotation qui repart à 1.
  - Toute autre rupture évidente dans la structure ou le contenu qui indique un changement de document.
- Si tu hésites entre "nouveau document" ou "simple nouvelle page", privilégie la cohérence :
  - Regroupe les pages qui partagent le même en-tête / numéro de facture / numéro de devis dans un même document.

GESTION DES PAGES :
- Si le texte OCR contient déjà des indications de pages (par exemple : "=== PAGE 3 ===", "Page 2/5", etc.), utilise-les pour déterminer "page_debut" et "page_fin".
- Si la pagination N'EST PAS explicite, déduis-la de la structure fournie :
  - considère que la première portion de texte correspond à la page 1, la suivante à la page 2, etc., selon les informations présentes dans le prompt utilisateur (ex : texte fourni page par page).
- Tu dois toujours renvoyer des entiers positifs pour "page_debut" et "page_fin".

RÈGLES DE COMPORTEMENT :
- Si tu ne peux pas déterminer un type précis de fichier, mets "type_fichier": "Autre".
- Si certaines pages semblent inutiles ou sans rapport (ex : page blanche, mention technique isolée), rattache-les au document le plus cohérent, en priorité au document précédent, sauf indication contraire claire.
- S'il n'y a qu'un seul document dans tout le texte, renvoie quand même un JSON avec une liste "documents" contenant un unique objet.

EXEMPLE DE STRUCTURE DE RÉPONSE :
{
  "documents": [
    {
      "type_fichier": "Facture",
      "nb_pages": 2,
      "page_debut": 1,
      "page_fin": 2,
      "contenu": "Texte complet de la facture, pages 1 et 2..."
    },
    {
      "type_fichier": "Devis",
      "nb_pages": 3,
      "page_debut": 3,
      "page_fin": 5,
      "contenu": "Texte complet du devis, pages 3 à 5..."
    }
  ]
}

NE JAMAIS :
- Ne jamais ajouter de commentaire hors du JSON.
- Ne jamais expliquer ton raisonnement.
- Ne jamais renvoyer de texte en dehors de la structure JSON décrite ci-dessus.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-5.2',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: extractedText },
        ]
      });

      let response = completion.choices[0]?.message?.content || '';

      // Clean response from markdown code blocks
      response = response.trim();
      if (response.startsWith('```json')) {
        response = response.substring(7); // Remove ```json
      } else if (response.startsWith('```')) {
        response = response.substring(3); // Remove ```
      }
      if (response.endsWith('```')) {
        response = response.substring(0, response.length - 3); // Remove ending ```
      }
      response = response.trim();

      // Parse JSON response
      const parsedResponse = JSON.parse(response);

      return parsedResponse;
    } catch (error) {
      console.error(`    [OpenAI] Error during analysis:`, error);
      throw error;
    }
  }

  private async generateSeparatePdfs(
    fileKey: string,
    documents: any[],
    fileFolder: string,
  ): Promise<Array<{ pdfPath: string; type_fichier: string; page_debut: number; page_fin: number }>> {
    const generatedPdfInfos: Array<{ pdfPath: string; type_fichier: string; page_debut: number; page_fin: number }> = [];

    try {
      // Download the original PDF from S3
      console.log(`      Downloading original PDF from S3...`);
      const getObjectCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const s3Response = await this.s3Client.send(getObjectCommand);

      if (!s3Response.Body) {
        throw new Error('No data received from S3');
      }

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of s3Response.Body as any) {
        chunks.push(chunk);
      }
      const pdfBuffer = Buffer.concat(chunks);

      // Load the PDF with pdf-lib
      console.log(`      Loading PDF document...`);
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      // Generate a PDF for each document
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const { type_fichier, page_debut, page_fin } = doc;

        console.log(
          `      Generating PDF ${i + 1}/${documents.length}: ${type_fichier} (pages ${page_debut}-${page_fin})`,
        );

        // Create a new PDF document
        const newPdf = await PDFDocument.create();

        // Copy pages from original PDF (page numbers are 1-indexed in the analysis, 0-indexed in pdf-lib)
        for (let pageNum = page_debut; pageNum <= page_fin; pageNum++) {
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
          newPdf.addPage(copiedPage);
        }

        // Generate filename with step number prefix
        const newFilename = `3_${type_fichier}_p${page_debut}-${page_fin}.pdf`;
        const outputPath = path.join(fileFolder, newFilename);

        // Save the new PDF
        const pdfBytes = await newPdf.save();
        await fs.writeFile(outputPath, pdfBytes);

        generatedPdfInfos.push({
          pdfPath: outputPath,
          type_fichier,
          page_debut,
          page_fin,
        });
      }

      console.log(
        `      Successfully generated ${generatedPdfInfos.length} PDF file(s)`,
      );

      return generatedPdfInfos;
    } catch (error) {
      console.error(`      [PDF Generation Error] Failed to generate PDFs:`, error);
      throw error;
    }
  }

  private async analyzeWithTextract(
    pdfInfos: Array<{ pdfPath: string; type_fichier: string; page_debut: number; page_fin: number }>,
    fileFolder: string,
  ): Promise<string[]> {
    const txtPaths: string[] = [];

    try {
      // Upload all PDFs to S3 in parallel
      console.log(`      Uploading ${pdfInfos.length} PDF(s) to S3...`);

      const uploadPromises = pdfInfos.map(async (pdfInfo) => {
        // Read the PDF file
        const pdfBuffer = await fs.readFile(pdfInfo.pdfPath);

        // Generate S3 key for the PDF
        const filename = path.basename(pdfInfo.pdfPath);
        const s3Key = `textract-temp/${Date.now()}_${filename}`;

        // Upload to S3
        const putCommand = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: s3Key,
          Body: pdfBuffer,
          ContentType: 'application/pdf',
        });

        await this.s3Client.send(putCommand);

        return { s3Key, pdfInfo };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Start Textract jobs sequentially with delay to avoid rate limiting
      console.log(`      Starting Textract jobs sequentially to avoid rate limits...`);
      const jobs: Array<{ jobId: string; pdfInfo: any }> = [];
      const DELAY_BETWEEN_JOBS = 5000; // 5 seconds delay between each job start

      for (let i = 0; i < uploadedFiles.length; i++) {
        const { s3Key, pdfInfo } = uploadedFiles[i];
        const filename = path.basename(pdfInfo.pdfPath);

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
          throw new Error(`Failed to start Textract job for ${filename}`);
        }

        console.log(`      Started Textract job ${i + 1}/${uploadedFiles.length} for ${filename}: ${jobId}`);

        jobs.push({ jobId, pdfInfo });

        // Add delay between job starts (except for the last one)
        if (i < uploadedFiles.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_JOBS));
        }
      }

      // Wait for all jobs to complete and retrieve results
      console.log(`      Waiting for ${jobs.length} Textract job(s) to complete...`);

      const resultPromises = jobs.map(async ({ jobId, pdfInfo }) => {
        const { type_fichier, page_debut, page_fin } = pdfInfo;

        const result = await this.retryWithBackoff(
          () => this.waitForTextractAnalysis(jobId),
          `Textract Analysis ${type_fichier}_p${page_debut}-${page_fin}`,
        );

        // Extract text from Textract blocks
        const extractedText = this.extractTextFromBlocks(result.Blocks);

        // Generate filename with step 4 prefix
        const txtFilename = `4_${type_fichier}_p${page_debut}-${page_fin}_textract.txt`;
        const txtPath = path.join(fileFolder, txtFilename);

        await fs.writeFile(txtPath, extractedText, 'utf-8');

        console.log(`      Saved Textract result: ${txtFilename}`);

        return txtPath;
      });

      const results = await Promise.all(resultPromises);
      txtPaths.push(...results);

      // Cleanup: Delete temporary S3 files
      console.log(`      Cleaning up ${uploadedFiles.length} temporary S3 file(s)...`);
      const deletePromises = uploadedFiles.map(async ({ s3Key }) => {
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: s3Key,
          });
          await this.s3Client.send(deleteCommand);
          console.log(`      Deleted S3 file: ${s3Key}`);
        } catch (error) {
          console.warn(`      Warning: Failed to delete S3 file ${s3Key}:`, error);
        }
      });

      await Promise.all(deletePromises);

      return txtPaths;
    } catch (error) {
      console.error(`      [Textract Error] Failed to analyze PDFs:`, error);
      throw error;
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
      .join('\n');

    return lines;
  }

  private async waitForTextractAnalysis(jobId: string): Promise<any> {
    let status = 'IN_PROGRESS';
    let allBlocks: any[] = [];
    let nextToken: string | undefined;

    while (status === 'IN_PROGRESS') {
      await new Promise((resolve) => setTimeout(resolve, this.TEXTRACT_POLLING_INTERVAL));

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
          DocumentMetadata: response.DocumentMetadata,
        };
      } else if (status === 'FAILED') {
        throw new Error(`Textract job ${jobId} failed`);
      }
    }
  }

  private async extractFieldsWithChatbase(txtPaths: string[], fileFolder: string): Promise<string[]> {
    const resultPaths: string[] = [];

    try {
      console.log(`      Processing ${txtPaths.length} text file(s) with Chatbase (Field Extraction)...`);

      // Process all text files in parallel
      const chatbasePromises = txtPaths.map(async (txtPath) => {
        // Read the text file
        const textContent = await fs.readFile(txtPath, 'utf-8');

        // Extract type_fichier and page info from filename
        // Format: 4_<type_fichier>_p<page_debut>-<page_fin>_textract.txt
        const filename = path.basename(txtPath);
        const match = filename.match(/^4_(.+)_(p\d+-\d+)_textract\.txt$/);

        if (!match) {
          throw new Error(`Unexpected filename format: ${filename}`);
        }

        const type_fichier = match[1];
        const pageRange = match[2];

        console.log(`      Sending ${type_fichier}_${pageRange} to Field Extraction...`);

        // Call Field Extraction chatbase
        const chatbaseResponse = await this.callChatbase(
          textContent,
          this.chatbaseFieldExtractionId,
          'Field Extraction'
        );

        // Parse the "text" field if it exists to get the actual JSON content
        let jsonContent = chatbaseResponse;
        if (chatbaseResponse && chatbaseResponse.text) {
          try {
            jsonContent = JSON.parse(chatbaseResponse.text);
          } catch (error) {
            console.warn(`      Warning: Could not parse text field as JSON for ${type_fichier}_${pageRange}`);
            jsonContent = chatbaseResponse;
          }
        }

        // Generate filename with step 5 prefix
        const chatbaseFilename = `5_${type_fichier}_${pageRange}_field_extraction.json`;
        const chatbasePath = path.join(fileFolder, chatbaseFilename);

        await fs.writeFile(chatbasePath, JSON.stringify(jsonContent, null, 2));

        console.log(`      Saved Field Extraction result: ${chatbaseFilename}`);

        return chatbasePath;
      });

      const results = await Promise.all(chatbasePromises);
      resultPaths.push(...results);

      return resultPaths;
    } catch (error) {
      console.error(`      [Chatbase Error] Failed to process with Chatbase:`, error);
      throw error;
    }
  }

  private async processFostIdentification(
    fieldExtractionPaths: string[],
    fileFolder: string,
  ): Promise<{ fostResultPath: string; aggregatedPath: string }> {
    try {
      console.log(`      Aggregating ${fieldExtractionPaths.length} field extraction(s)...`);

      // Read all field extraction JSON files
      const extractions = await Promise.all(
        fieldExtractionPaths.map(async (filePath) => {
          const content = await fs.readFile(filePath, 'utf-8');
          return JSON.parse(content);
        }),
      );

      // Create aggregated JSON
      const aggregatedData = {
        extraction_count: extractions.length,
        extractions: extractions,
      };

      // Save aggregated JSON with step 6 prefix
      const aggregatedFilename = `6_aggregated_field_extractions.json`;
      const aggregatedPath = path.join(fileFolder, aggregatedFilename);

      await fs.writeFile(aggregatedPath, JSON.stringify(aggregatedData, null, 2));

      console.log(`      Saved aggregated extractions: ${aggregatedFilename}`);

      // Send to FOST Identification chatbase
      console.log(`      Sending aggregated data to FOST Identification...`);

      const fostResponse = await this.callChatbase(
        JSON.stringify(aggregatedData),
        this.chatbaseFostIdentificationId,
        'FOST Identification',
      );

      // Parse the "text" field if it exists to get the actual JSON content
      let fostJsonContent = fostResponse;
      if (fostResponse && fostResponse.text) {
        try {
          fostJsonContent = JSON.parse(fostResponse.text);
        } catch (error) {
          console.warn(`      Warning: Could not parse FOST text field as JSON`);
          fostJsonContent = fostResponse;
        }
      }

      // Save FOST Identification result with step 6 prefix
      const fostFilename = `6_fost_identification.json`;
      const fostPath = path.join(fileFolder, fostFilename);

      await fs.writeFile(fostPath, JSON.stringify(fostJsonContent, null, 2));

      console.log(`      Saved FOST Identification result: ${fostFilename}`);

      return { fostResultPath: fostPath, aggregatedPath };
    } catch (error) {
      console.error(`      [FOST Identification Error]:`, error);
      throw error;
    }
  }

  private async processDossierAnalysis(
    aggregatedFieldExtractionsPath: string,
    fostResultPath: string,
    fileFolder: string,
  ): Promise<string> {
    try {
      console.log(`      Reading aggregated field extractions and FOST result...`);

      // Read aggregated field extractions
      const aggregatedContent = await fs.readFile(aggregatedFieldExtractionsPath, 'utf-8');
      const aggregatedData = JSON.parse(aggregatedContent);

      // Read FOST result (already parsed JSON without "text" field)
      const fostContent = await fs.readFile(fostResultPath, 'utf-8');
      const fostData = JSON.parse(fostContent);

      // The FOST result is now directly the parsed JSON
      // If it's an array, use it directly; otherwise wrap it in an array
      let fostsArray: any[] = [];
      if (Array.isArray(fostData)) {
        fostsArray = fostData;
      } else if (fostData) {
        fostsArray = [fostData];
      }

      // Create enhanced JSON with fosts array (based on aggregated data, not FOST data)
      const enhancedData = {
        ...aggregatedData,
        fosts: fostsArray,
      };

      // Save enhanced JSON with step 7 prefix
      const enhancedFilename = `7_enhanced_fost.json`;
      const enhancedPath = path.join(fileFolder, enhancedFilename);

      await fs.writeFile(enhancedPath, JSON.stringify(enhancedData, null, 2));

      console.log(`      Saved enhanced FOST data: ${enhancedFilename}`);

      // Send to Dossier Analysis chatbase
      console.log(`      Sending to Dossier Analysis...`);

      const analysisResponse = await this.callChatbase(
        JSON.stringify(enhancedData),
        this.chatbaseDossierAnalysisId,
        'Dossier Analysis',
      );

      // Parse the "text" field if it exists to get the actual JSON content
      let analysisJsonContent = analysisResponse;
      if (analysisResponse && analysisResponse.text) {
        try {
          analysisJsonContent = JSON.parse(analysisResponse.text);
        } catch (error) {
          console.warn(`      Warning: Could not parse Dossier Analysis text field as JSON`);
          analysisJsonContent = analysisResponse;
        }
      }

      // Save Dossier Analysis result with step 7 prefix
      const analysisFilename = `7_dossier_analysis.json`;
      const analysisPath = path.join(fileFolder, analysisFilename);

      await fs.writeFile(analysisPath, JSON.stringify(analysisJsonContent, null, 2));

      console.log(`      Saved Dossier Analysis result: ${analysisFilename}`);

      return analysisPath;
    } catch (error) {
      console.error(`      [Dossier Analysis Error]:`, error);
      throw error;
    }
  }

  private async processDossierInterpretation(
    analysisResultPath: string,
    fileFolder: string,
  ): Promise<string> {
    try {
      console.log(`      Reading Dossier Analysis result...`);

      // Read Dossier Analysis result
      const analysisContent = await fs.readFile(analysisResultPath, 'utf-8');
      let analysisData = JSON.parse(analysisContent);

      // Unwrap "content" field if it exists - extract content to root
      if (analysisData && typeof analysisData === 'object' && 'content' in analysisData && Object.keys(analysisData).length === 1) {
        analysisData = analysisData.content;
      }

      // Send to Dossier Interpretation chatbase
      console.log(`      Sending to Dossier Interpretation...`);

      const analysisDataString = JSON.stringify(analysisData, null, 2);

      // Call chatbase for validation/processing (response not used in output file)
      await this.callChatbase(
        analysisDataString,
        this.chatbaseDossierInterpretationId,
        'Dossier Interpretation',
      );

      // Save the data that was sent to chatbase (not the response)
      // The file 8_rapport_analyse.json should be identical to what was sent
      const reportFilename = `8_rapport_analyse.json`;
      const reportPath = path.join(fileFolder, reportFilename);

      await fs.writeFile(reportPath, JSON.stringify(analysisData, null, 2), 'utf-8');

      console.log(`      Saved analysis report: ${reportFilename}`);

      return reportPath;
    } catch (error) {
      console.error(`      [Dossier Interpretation Error]:`, error);
      throw error;
    }
  }

  private async generateFinalInterpretation(
    dossierAnalysisJsonPath: string,
    fileFolder: string,
  ): Promise<string> {
    try {
      console.log(`      Reading dossier_analysis.json...`);

      // Read dossier_analysis JSON
      const analysisContent = await fs.readFile(dossierAnalysisJsonPath, 'utf-8');
      const analysisData = JSON.parse(analysisContent);

      // Send to Interprétation du dossier chatbase
      console.log(`      Sending to Interprétation du dossier for final text...`);

      const interpretationResponse = await this.callChatbase(
        JSON.stringify(analysisData),
        this.chatbaseDossierInterpretationId,
        'Interprétation du dossier (Final)',
      );

      // Extract the "text" field from response
      let textContent = '';
      if (interpretationResponse && typeof interpretationResponse === 'object' && interpretationResponse.text) {
        textContent = interpretationResponse.text;
      } else if (typeof interpretationResponse === 'string') {
        textContent = interpretationResponse;
      } else {
        // If no text field, convert the whole response to string
        textContent = JSON.stringify(interpretationResponse, null, 2);
      }

      // Save as TXT file with step 9 prefix
      const txtFilename = `9_interpretation_finale.txt`;
      const txtPath = path.join(fileFolder, txtFilename);

      await fs.writeFile(txtPath, textContent, 'utf-8');

      console.log(`      Saved final interpretation text: ${txtFilename}`);

      return txtPath;
    } catch (error) {
      console.error(`      [Final Interpretation Error]:`, error);
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
      `        Sending ${chunks.length} chunk(s) (${data.length} total characters)`,
    );

    return {
      messages: messages,
      chatbotId: chatbotId,
      stream: false,
    };
  }

  private async callChatbase(textData: string, chatbotId: string, chatbotName: string): Promise<any> {
    return this.retryWithBackoff(
      async () => {
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
      },
      `Chatbase ${chatbotName}`,
    );
  }

  private formatDuration(seconds: string): string {
    const totalSeconds = parseFloat(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = (totalSeconds % 60).toFixed(2);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.padStart(5, '0')}`;
  }

  private formatDurationFromNumber(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.padStart(5, '0')}`;
  }

  private generateBatchReport(
    fileResults: Array<{ file: string; duration: number; success: boolean; error?: string }>,
    totalDuration: number,
    config: { startIndex: number; endIndex: number; maxParallel: number; debug: boolean },
  ): string {
    const now = new Date();
    const timestamp = now.toISOString();
    const successCount = fileResults.filter(r => r.success).length;
    const failedCount = fileResults.filter(r => !r.success).length;
    const totalFiles = fileResults.length;

    let report = `╔══════════════════════════════════════════════════════════════════════════════╗
║                        RAPPORT GLOBAL DU BATCH                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

Date d'exécution      : ${timestamp}
Fichiers traités      : ${totalFiles}
Fichiers réussis      : ${successCount}
Fichiers échoués      : ${failedCount}
Durée totale du batch : ${this.formatDurationFromNumber(totalDuration)}

Configuration:
  - Index de début      : ${config.startIndex}
  - Index de fin        : ${config.endIndex - 1}
  - Parallélisme max    : ${config.maxParallel}
  - Mode debug          : ${config.debug ? 'ACTIVÉ' : 'DÉSACTIVÉ'}

┌──────────────────────────────────────────────────────────────────────────────┐
│ TEMPS DE TRAITEMENT PAR FICHIER                                              │
└──────────────────────────────────────────────────────────────────────────────┘

`;

    fileResults.forEach((result, index) => {
      const status = result.success ? '✓' : '✗';
      const fileName = path.basename(result.file);
      const duration = this.formatDurationFromNumber(result.duration);
      report += `  ${status} ${(index + 1).toString().padStart(3, ' ')}. ${fileName.padEnd(50, ' ')} ${duration}\n`;
      if (!result.success && result.error) {
        report += `      Erreur: ${result.error}\n`;
      }
    });

    report += `
┌──────────────────────────────────────────────────────────────────────────────┐
│ STATISTIQUES                                                                  │
└──────────────────────────────────────────────────────────────────────────────┘

`;

    if (successCount > 0) {
      const successfulResults = fileResults.filter(r => r.success);
      const avgDuration = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successCount;
      const minDuration = Math.min(...successfulResults.map(r => r.duration));
      const maxDuration = Math.max(...successfulResults.map(r => r.duration));

      report += `  Durée moyenne par fichier (réussi)  : ${this.formatDurationFromNumber(avgDuration)}\n`;
      report += `  Durée minimale                       : ${this.formatDurationFromNumber(minDuration)}\n`;
      report += `  Durée maximale                       : ${this.formatDurationFromNumber(maxDuration)}\n`;
    }

    report += `
╔══════════════════════════════════════════════════════════════════════════════╗
║                              FIN DU RAPPORT                                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;

    return report;
  }

  private generateExecutionReport(data: {
    ocrDuration: string;
    openaiDuration: string;
    pdfDuration: string;
    textractDuration: string;
    chatbaseDuration: string;
    fostDuration: string;
    analysisDuration: string;
    interpretationDuration: string;
    finalInterpretationDuration: string;
    totalDuration: string;
    fileKey: string;
    documentsCount: number;
  }): string {
    const now = new Date();
    const timestamp = now.toISOString();

    return `╔══════════════════════════════════════════════════════════════════════════════╗
║                        RAPPORT D'EXÉCUTION DU TRAITEMENT                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

Date d'exécution : ${timestamp}
Fichier traité   : ${data.fileKey}
Documents trouvés: ${data.documentsCount}

┌──────────────────────────────────────────────────────────────────────────────┐
│ TEMPS D'EXÉCUTION PAR ÉTAPE                                                  │
└──────────────────────────────────────────────────────────────────────────────┘

  Étape 1 - Extraction OCR (TOTAL)                  : ${this.formatDuration(data.ocrDuration)}
  Étape 2 - Analyse OpenAI (découpage)              : ${this.formatDuration(data.openaiDuration)}
  Étape 3 - Génération des PDFs                     : ${this.formatDuration(data.pdfDuration)}
  Étape 4 - Analyse OCR Textract                    : ${this.formatDuration(data.textractDuration)}
  Étape 5 - Extraction des champs                   : ${this.formatDuration(data.chatbaseDuration)}
  Étape 6 - Identification de la FOST               : ${this.formatDuration(data.fostDuration)}
  Étape 7 - Analyse du dossier                      : ${this.formatDuration(data.analysisDuration)}
  Étape 8 - Interprétation du dossier               : ${this.formatDuration(data.interpretationDuration)}
  Étape 9 - Génération du rapport                   : ${this.formatDuration(data.finalInterpretationDuration)}

┌──────────────────────────────────────────────────────────────────────────────┐
│ TEMPS TOTAL                                                                   │
└──────────────────────────────────────────────────────────────────────────────┘

  Durée totale du traitement                        : ${this.formatDuration(data.totalDuration)}

╔══════════════════════════════════════════════════════════════════════════════╗
║                              FIN DU RAPPORT                                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;
  }

  private async listPdfFiles(folder?: string): Promise<string[]> {
    let prefix = '';
    if (folder && folder.trim() !== '') {
      prefix = folder.endsWith('/') ? folder : `${folder}/`;
    }

    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      ...(prefix && { Prefix: prefix }),
    });

    const response = await this.s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }

    return response.Contents.filter((item) =>
      item.Key?.toLowerCase().endsWith('.pdf'),
    )
      .map((item) => item.Key)
      .filter((key): key is string => key !== undefined);
  }
}