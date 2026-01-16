"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_2 = require("@aws-sdk/client-s3");
const client_textract_1 = require("@aws-sdk/client-textract");
const ocr_space_api_wrapper_1 = require("ocr-space-api-wrapper");
const openai_1 = __importDefault(require("openai"));
const pdf_lib_1 = require("pdf-lib");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let BatchService = class BatchService {
    configService;
    s3Client;
    textractClient;
    openai;
    bucketName;
    ocrApiKey;
    ocrUrl;
    chatbaseApiUrl;
    chatbaseBearerToken;
    chatbaseFieldExtractionId;
    chatbaseFostIdentificationId;
    chatbaseDossierAnalysisId;
    chatbaseDossierInterpretationId;
    MAX_RETRIES = 20;
    INITIAL_RETRY_DELAY = 5000;
    TEXTRACT_POLLING_INTERVAL = 10000;
    constructor(configService) {
        this.configService = configService;
        const region = this.configService.get('AWS_REGION');
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const bucketName = this.configService.get('S3_BUCKET_NAME');
        const openaiApiKey = this.configService.get('OPENAI_API_KEY');
        const ocrApiKey = this.configService.get('OCR_SPACE_API_KEY');
        const ocrUrl = this.configService.get('OCR_SPACE_URL');
        const chatbaseApiUrl = this.configService.get('CHATBASE_API_URL');
        const chatbaseBearerToken = this.configService.get('CHATBASE_BEARER_TOKEN');
        const chatbaseFieldExtractionId = this.configService.get('CHATBASE_FIELD_EXTRACTION_CHATBOT_ID');
        const chatbaseFostIdentificationId = this.configService.get('CHATBASE_FOST_IDENTIFICATION_CHATBOT_ID');
        const chatbaseDossierAnalysisId = this.configService.get('CHATBASE_DOSSIER_ANALYSIS_CHATBOT_ID');
        const chatbaseDossierInterpretationId = this.configService.get('CHATBASE_DOSSIER_INTERPRETATION_CHATBOT_ID');
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
        this.s3Client = new client_s3_1.S3Client({
            region,
            credentials,
        });
        this.textractClient = new client_textract_1.TextractClient({
            region,
            credentials,
        });
        this.openai = new openai_1.default({
            apiKey: openaiApiKey,
            timeout: 120000,
            maxRetries: 0,
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
    async retryWithBackoff(operation, stepName, attempt = 1) {
        try {
            return await operation();
        }
        catch (error) {
            if (attempt >= this.MAX_RETRIES) {
                console.error(`      [${stepName}] Max retries (${this.MAX_RETRIES}) reached. Giving up.`);
                throw error;
            }
            const delay = this.INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`      [${stepName}] Error on attempt ${attempt}/${this.MAX_RETRIES}: ${errorMessage}`);
            console.log(`      [${stepName}] Retrying in ${(delay / 1000).toFixed(1)}s...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.retryWithBackoff(operation, stepName, attempt + 1);
        }
    }
    async processBatch(batchDto) {
        const allPdfFiles = await this.listPdfFiles(batchDto.folder);
        console.log('PDF files found in S3:');
        console.log(JSON.stringify(allPdfFiles, null, 2));
        console.log(`Total files in folder: ${allPdfFiles.length}`);
        const startIndex = batchDto.startIndex ?? 0;
        const fileCount = batchDto.fileCount ?? allPdfFiles.length;
        const debug = batchDto.debug ?? false;
        const maxParallel = batchDto.maxParallelProcessing ??
            this.configService.get('MAX_PARALLEL_PROCESSING') ?? 3;
        const endIndex = Math.min(startIndex + fileCount, allPdfFiles.length);
        const pdfFiles = allPdfFiles.slice(startIndex, endIndex);
        console.log(`\nProcessing range: files ${startIndex} to ${endIndex - 1} (${pdfFiles.length} files)`);
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
    async processFilesInParallel(files, maxParallel, debug) {
        const results = [];
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
                    console.log(`[Worker ${activeWorkers}] Starting file ${currentIndex + 1}/${files.length}: ${file}`);
                    const fileStartTime = Date.now();
                    const promise = this.processFile(file, currentIndex + 1, files.length, debug)
                        .then(() => {
                        completed++;
                        activeWorkers--;
                        const duration = (Date.now() - fileStartTime) / 1000;
                        console.log(`[Completed ${completed}/${files.length}] Finished: ${file}`);
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
    async processFile(fileKey, current, total, debug) {
        console.log(`  - Processing ${current}/${total}: ${fileKey}`);
        const fileStartTime = Date.now();
        try {
            const originalFilename = path.basename(fileKey, '.pdf');
            const fileFolder = path.join(process.cwd(), 'temp', originalFilename);
            await fs.mkdir(fileFolder, { recursive: true });
            console.log(`    Created folder: ${originalFilename}/`);
            console.log(`    [Step 1] Starting OCR.space text extraction...`);
            const ocrStartTime = Date.now();
            const extractedText = await this.retryWithBackoff(() => this.extractTextWithOCR(fileKey), 'OCR Extraction');
            const ocrDuration = ((Date.now() - ocrStartTime) / 1000).toFixed(2);
            console.log(`    [Step 1 - OCR.space] Completed in ${ocrDuration}s - Extracted ${extractedText.length} characters`);
            const ocrFilename = `1_ocr_extraction.txt`;
            const ocrPath = path.join(fileFolder, ocrFilename);
            await fs.writeFile(ocrPath, extractedText, 'utf-8');
            console.log(`      Saved OCR result: ${ocrFilename}`);
            console.log(`    [Step 2] Starting OpenAI analysis...`);
            const openaiStartTime = Date.now();
            const analysisResult = await this.retryWithBackoff(() => this.analyzeWithOpenAI(extractedText), 'OpenAI Analysis');
            const openaiDuration = ((Date.now() - openaiStartTime) / 1000).toFixed(2);
            console.log(`    [Step 2 - OpenAI] Completed in ${openaiDuration}s - Documents detected: ${analysisResult.documents?.length || 0}`);
            const openaiFilename = `2_openai_analysis.json`;
            const openaiPath = path.join(fileFolder, openaiFilename);
            await fs.writeFile(openaiPath, JSON.stringify(analysisResult, null, 2), 'utf-8');
            console.log(`      Saved OpenAI analysis: ${openaiFilename}`);
            if (analysisResult.documents && analysisResult.documents.length > 0) {
                analysisResult.documents.forEach((doc, index) => {
                    console.log(`      [Document ${index + 1}] Type: ${doc.type_fichier}, Pages: ${doc.page_debut}-${doc.page_fin}`);
                });
                console.log(`    [Step 3] Generating separate PDFs...`);
                const pdfStartTime = Date.now();
                const generatedPdfs = await this.generateSeparatePdfs(fileKey, analysisResult.documents, fileFolder);
                const pdfDuration = ((Date.now() - pdfStartTime) / 1000).toFixed(2);
                console.log(`    [Step 3 - PDF Generation] Completed in ${pdfDuration}s - Generated ${generatedPdfs.length} PDF(s)`);
                generatedPdfs.forEach((pdfInfo, index) => {
                    console.log(`      [PDF ${index + 1}] ${pdfInfo.pdfPath}`);
                });
                console.log(`    [Step 4] Analyzing PDFs with Textract...`);
                const textractStartTime = Date.now();
                const textractResults = await this.analyzeWithTextract(generatedPdfs, fileFolder);
                const textractDuration = ((Date.now() - textractStartTime) / 1000).toFixed(2);
                console.log(`    [Step 4 - Textract] Completed in ${textractDuration}s - Analyzed ${textractResults.length} PDF(s)`);
                textractResults.forEach((result, index) => {
                    console.log(`      [JSON ${index + 1}] ${result}`);
                });
                console.log(`    [Step 5] Extracting fields with Chatbase...`);
                const chatbaseStartTime = Date.now();
                const chatbaseResults = await this.extractFieldsWithChatbase(textractResults, fileFolder);
                const chatbaseDuration = ((Date.now() - chatbaseStartTime) / 1000).toFixed(2);
                console.log(`    [Step 5 - Chatbase] Completed in ${chatbaseDuration}s - Processed ${chatbaseResults.length} document(s)`);
                chatbaseResults.forEach((result, index) => {
                    console.log(`      [Chatbase ${index + 1}] ${result}`);
                });
                console.log(`    [Step 6] Aggregating extractions and calling FOST Identification...`);
                const fostStartTime = Date.now();
                const { fostResultPath, aggregatedPath } = await this.processFostIdentification(chatbaseResults, fileFolder);
                const fostDuration = ((Date.now() - fostStartTime) / 1000).toFixed(2);
                console.log(`    [Step 6 - FOST Identification] Completed in ${fostDuration}s`);
                console.log(`      [FOST Result] ${fostResultPath}`);
                console.log(`    [Step 7] Processing Dossier Analysis...`);
                const analysisStartTime = Date.now();
                const dossierAnalysisResult = await this.processDossierAnalysis(aggregatedPath, fostResultPath, fileFolder);
                const analysisDuration = ((Date.now() - analysisStartTime) / 1000).toFixed(2);
                console.log(`    [Step 7 - Dossier Analysis] Completed in ${analysisDuration}s`);
                console.log(`      [Analysis Result] ${dossierAnalysisResult}`);
                console.log(`    [Step 8] Generating final interpretation text...`);
                const finalInterpretationStartTime = Date.now();
                const finalReportPath = await this.generateFinalInterpretation(dossierAnalysisResult, fileFolder);
                const finalInterpretationDuration = ((Date.now() - finalInterpretationStartTime) / 1000).toFixed(2);
                console.log(`    [Step 8 - Final Interpretation] Completed in ${finalInterpretationDuration}s`);
                console.log(`      [Final Report] ${finalReportPath}`);
                const executionReport = this.generateExecutionReport({
                    ocrDuration,
                    openaiDuration,
                    pdfDuration,
                    textractDuration,
                    chatbaseDuration,
                    fostDuration,
                    analysisDuration,
                    finalInterpretationDuration,
                    totalDuration: ((Date.now() - fileStartTime) / 1000).toFixed(2),
                    fileKey,
                    documentsCount: analysisResult.documents?.length || 0,
                });
                const executionReportFilename = `99-execution_report.txt`;
                const executionReportPath = path.join(fileFolder, executionReportFilename);
                await fs.writeFile(executionReportPath, executionReport, 'utf-8');
                console.log(`    [Execution Report] Saved: ${executionReportFilename}`);
                if (!debug) {
                    console.log(`    [Cleanup] Removing temporary files (keeping only 8_interpretation_finale.txt)...`);
                    const files = await fs.readdir(fileFolder);
                    let deletedCount = 0;
                    for (const file of files) {
                        if (file !== '8_interpretation_finale.txt') {
                            const filePath = path.join(fileFolder, file);
                            await fs.unlink(filePath);
                            deletedCount++;
                        }
                    }
                    console.log(`    [Cleanup] Removed ${deletedCount} temporary file(s)`);
                }
                else {
                    console.log(`    [Debug Mode] Keeping all ${analysisResult.documents?.length || 0} temporary files`);
                }
            }
            const totalDuration = ((Date.now() - fileStartTime) / 1000).toFixed(2);
            console.log(`  - Completed ${current}/${total}: ${fileKey} in ${totalDuration}s\n`);
        }
        catch (error) {
            console.error(`    [Error] Failed to process ${fileKey}:`, error);
            throw error;
        }
    }
    async extractTextWithOCR(fileKey) {
        try {
            console.log(`      Generating signed URL from S3...`);
            const getObjectCommand = new client_s3_2.GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey,
            });
            const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, getObjectCommand, {
                expiresIn: 3600,
            });
            console.log(`      Sending file URL to OCR.space...`);
            const ocrResult = await (0, ocr_space_api_wrapper_1.ocrSpace)(signedUrl, {
                apiKey: this.ocrApiKey,
                language: 'fre',
                OCREngine: "1",
                isTable: false,
                isSearchablePdfHideTextLayer: true,
                scale: true,
                filetype: 'PDF',
                ocrUrl: this.ocrUrl,
            });
            if (ocrResult && ocrResult.ParsedResults) {
                const allText = ocrResult.ParsedResults.map((result) => result.ParsedText || '').join('\n');
                return allText;
            }
            throw new Error('No text extracted from OCR.space');
        }
        catch (error) {
            console.error(`      [OCR Error] Failed to extract text:`, error);
            throw error;
        }
    }
    async analyzeWithOpenAI(extractedText) {
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
            response = response.trim();
            if (response.startsWith('```json')) {
                response = response.substring(7);
            }
            else if (response.startsWith('```')) {
                response = response.substring(3);
            }
            if (response.endsWith('```')) {
                response = response.substring(0, response.length - 3);
            }
            response = response.trim();
            const parsedResponse = JSON.parse(response);
            return parsedResponse;
        }
        catch (error) {
            console.error(`    [OpenAI] Error during analysis:`, error);
            throw error;
        }
    }
    async generateSeparatePdfs(fileKey, documents, fileFolder) {
        const generatedPdfInfos = [];
        try {
            console.log(`      Downloading original PDF from S3...`);
            const getObjectCommand = new client_s3_2.GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey,
            });
            const s3Response = await this.s3Client.send(getObjectCommand);
            if (!s3Response.Body) {
                throw new Error('No data received from S3');
            }
            const chunks = [];
            for await (const chunk of s3Response.Body) {
                chunks.push(chunk);
            }
            const pdfBuffer = Buffer.concat(chunks);
            console.log(`      Loading PDF document...`);
            const pdfDoc = await pdf_lib_1.PDFDocument.load(pdfBuffer);
            const totalPages = pdfDoc.getPageCount();
            console.log(`      PDF has ${totalPages} pages`);
            for (let i = 0; i < documents.length; i++) {
                const doc = documents[i];
                const { type_fichier, page_debut, page_fin } = doc;
                if (page_debut === undefined || page_fin === undefined || page_debut < 1 || page_fin < 1) {
                    console.warn(`      Skipping document ${i + 1}: invalid page range (page_debut: ${page_debut}, page_fin: ${page_fin})`);
                    continue;
                }
                console.log(`      Generating PDF ${i + 1}/${documents.length}: ${type_fichier} (pages ${page_debut}-${page_fin})`);
                const newPdf = await pdf_lib_1.PDFDocument.create();
                for (let pageNum = page_debut; pageNum <= page_fin; pageNum++) {
                    if (pageNum > totalPages) {
                        console.warn(`      Skipping page ${pageNum}: exceeds total pages (${totalPages})`);
                        continue;
                    }
                    const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
                    newPdf.addPage(copiedPage);
                }
                if (newPdf.getPageCount() === 0) {
                    console.warn(`      Skipping document ${i + 1}: no valid pages to copy`);
                    continue;
                }
                const newFilename = `3_${type_fichier}_p${page_debut}-${page_fin}.pdf`;
                const outputPath = path.join(fileFolder, newFilename);
                const pdfBytes = await newPdf.save();
                await fs.writeFile(outputPath, pdfBytes);
                generatedPdfInfos.push({
                    pdfPath: outputPath,
                    type_fichier,
                    page_debut,
                    page_fin,
                });
            }
            console.log(`      Successfully generated ${generatedPdfInfos.length} PDF file(s)`);
            return generatedPdfInfos;
        }
        catch (error) {
            console.error(`      [PDF Generation Error] Failed to generate PDFs:`, error);
            throw error;
        }
    }
    async analyzeWithTextract(pdfInfos, fileFolder) {
        const txtPaths = [];
        try {
            console.log(`      Uploading ${pdfInfos.length} PDF(s) to S3...`);
            const uploadPromises = pdfInfos.map(async (pdfInfo) => {
                const pdfBuffer = await fs.readFile(pdfInfo.pdfPath);
                const filename = path.basename(pdfInfo.pdfPath);
                const s3Key = `textract-temp/${Date.now()}_${filename}`;
                const putCommand = new client_s3_1.PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: s3Key,
                    Body: pdfBuffer,
                    ContentType: 'application/pdf',
                });
                await this.s3Client.send(putCommand);
                return { s3Key, pdfInfo };
            });
            const uploadedFiles = await Promise.all(uploadPromises);
            console.log(`      Starting Textract jobs sequentially to avoid rate limits...`);
            const jobs = [];
            const DELAY_BETWEEN_JOBS = 5000;
            for (let i = 0; i < uploadedFiles.length; i++) {
                const { s3Key, pdfInfo } = uploadedFiles[i];
                const filename = path.basename(pdfInfo.pdfPath);
                const startCommand = new client_textract_1.StartDocumentAnalysisCommand({
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
                if (i < uploadedFiles.length - 1) {
                    await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_JOBS));
                }
            }
            console.log(`      Waiting for ${jobs.length} Textract job(s) to complete...`);
            const resultPromises = jobs.map(async ({ jobId, pdfInfo }) => {
                const { type_fichier, page_debut, page_fin } = pdfInfo;
                const result = await this.retryWithBackoff(() => this.waitForTextractAnalysis(jobId), `Textract Analysis ${type_fichier}_p${page_debut}-${page_fin}`);
                const extractedText = this.extractTextFromBlocks(result.Blocks);
                const txtFilename = `4_${type_fichier}_p${page_debut}-${page_fin}_textract.txt`;
                const txtPath = path.join(fileFolder, txtFilename);
                await fs.writeFile(txtPath, extractedText, 'utf-8');
                console.log(`      Saved Textract result: ${txtFilename}`);
                return txtPath;
            });
            const results = await Promise.all(resultPromises);
            txtPaths.push(...results);
            console.log(`      Cleaning up ${uploadedFiles.length} temporary S3 file(s)...`);
            const deletePromises = uploadedFiles.map(async ({ s3Key }) => {
                try {
                    const deleteCommand = new client_s3_1.DeleteObjectCommand({
                        Bucket: this.bucketName,
                        Key: s3Key,
                    });
                    await this.s3Client.send(deleteCommand);
                    console.log(`      Deleted S3 file: ${s3Key}`);
                }
                catch (error) {
                    console.warn(`      Warning: Failed to delete S3 file ${s3Key}:`, error);
                }
            });
            await Promise.all(deletePromises);
            return txtPaths;
        }
        catch (error) {
            console.error(`      [Textract Error] Failed to analyze PDFs:`, error);
            throw error;
        }
    }
    extractTextFromBlocks(blocks) {
        if (!blocks || blocks.length === 0) {
            return '';
        }
        const lines = blocks
            .filter((block) => block.BlockType === 'LINE')
            .map((block) => block.Text || '')
            .join('\n');
        return lines;
    }
    async waitForTextractAnalysis(jobId) {
        let status = 'IN_PROGRESS';
        let allBlocks = [];
        let nextToken;
        while (status === 'IN_PROGRESS') {
            await new Promise((resolve) => setTimeout(resolve, this.TEXTRACT_POLLING_INTERVAL));
            const getCommand = new client_textract_1.GetDocumentAnalysisCommand({
                JobId: jobId,
            });
            const response = await this.textractClient.send(getCommand);
            status = response.JobStatus || 'FAILED';
            if (status === 'SUCCEEDED') {
                allBlocks = response.Blocks || [];
                nextToken = response.NextToken;
                while (nextToken) {
                    const nextCommand = new client_textract_1.GetDocumentAnalysisCommand({
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
            }
            else if (status === 'FAILED') {
                throw new Error(`Textract job ${jobId} failed`);
            }
        }
    }
    async extractFieldsWithChatbase(txtPaths, fileFolder) {
        const resultPaths = [];
        try {
            console.log(`      Processing ${txtPaths.length} text file(s) with Chatbase (Field Extraction)...`);
            const chatbasePromises = txtPaths.map(async (txtPath) => {
                const textContent = await fs.readFile(txtPath, 'utf-8');
                const filename = path.basename(txtPath);
                const match = filename.match(/^4_(.+)_(p\d+-\d+)_textract\.txt$/);
                if (!match) {
                    throw new Error(`Unexpected filename format: ${filename}`);
                }
                const type_fichier = match[1];
                const pageRange = match[2];
                console.log(`      Sending ${type_fichier}_${pageRange} to Field Extraction...`);
                const chatbaseResponse = await this.callChatbase(textContent, this.chatbaseFieldExtractionId, 'Field Extraction');
                let jsonContent = chatbaseResponse;
                if (chatbaseResponse && chatbaseResponse.text) {
                    try {
                        jsonContent = JSON.parse(chatbaseResponse.text);
                    }
                    catch (error) {
                        console.warn(`      Warning: Could not parse text field as JSON for ${type_fichier}_${pageRange}`);
                        jsonContent = chatbaseResponse;
                    }
                }
                const chatbaseFilename = `5_${type_fichier}_${pageRange}_field_extraction.json`;
                const chatbasePath = path.join(fileFolder, chatbaseFilename);
                await fs.writeFile(chatbasePath, JSON.stringify(jsonContent, null, 2));
                console.log(`      Saved Field Extraction result: ${chatbaseFilename}`);
                return chatbasePath;
            });
            const results = await Promise.all(chatbasePromises);
            resultPaths.push(...results);
            return resultPaths;
        }
        catch (error) {
            console.error(`      [Chatbase Error] Failed to process with Chatbase:`, error);
            throw error;
        }
    }
    async processFostIdentification(fieldExtractionPaths, fileFolder) {
        try {
            console.log(`      Aggregating ${fieldExtractionPaths.length} field extraction(s)...`);
            const extractions = await Promise.all(fieldExtractionPaths.map(async (filePath) => {
                const content = await fs.readFile(filePath, 'utf-8');
                return JSON.parse(content);
            }));
            const aggregatedData = {
                extraction_count: extractions.length,
                extractions: extractions,
            };
            const aggregatedFilename = `6_aggregated_field_extractions.json`;
            const aggregatedPath = path.join(fileFolder, aggregatedFilename);
            await fs.writeFile(aggregatedPath, JSON.stringify(aggregatedData, null, 2));
            console.log(`      Saved aggregated extractions: ${aggregatedFilename}`);
            console.log(`      Sending aggregated data to FOST Identification...`);
            const fostResponse = await this.callChatbase(JSON.stringify(aggregatedData), this.chatbaseFostIdentificationId, 'FOST Identification');
            let fostJsonContent = fostResponse;
            if (fostResponse && fostResponse.text) {
                try {
                    fostJsonContent = JSON.parse(fostResponse.text);
                }
                catch (error) {
                    console.warn(`      Warning: Could not parse FOST text field as JSON`);
                    fostJsonContent = fostResponse;
                }
            }
            const fostFilename = `6_fost_identification.json`;
            const fostPath = path.join(fileFolder, fostFilename);
            await fs.writeFile(fostPath, JSON.stringify(fostJsonContent, null, 2));
            console.log(`      Saved FOST Identification result: ${fostFilename}`);
            return { fostResultPath: fostPath, aggregatedPath };
        }
        catch (error) {
            console.error(`      [FOST Identification Error]:`, error);
            throw error;
        }
    }
    async processDossierAnalysis(aggregatedFieldExtractionsPath, fostResultPath, fileFolder) {
        try {
            console.log(`      Reading aggregated field extractions and FOST result...`);
            const aggregatedContent = await fs.readFile(aggregatedFieldExtractionsPath, 'utf-8');
            const aggregatedData = JSON.parse(aggregatedContent);
            const fostContent = await fs.readFile(fostResultPath, 'utf-8');
            const fostData = JSON.parse(fostContent);
            let fostsArray = [];
            if (Array.isArray(fostData)) {
                fostsArray = fostData;
            }
            else if (fostData) {
                fostsArray = [fostData];
            }
            const enhancedData = {
                ...aggregatedData,
                fosts: fostsArray,
            };
            const enhancedFilename = `7_enhanced_fost.json`;
            const enhancedPath = path.join(fileFolder, enhancedFilename);
            await fs.writeFile(enhancedPath, JSON.stringify(enhancedData, null, 2));
            console.log(`      Saved enhanced FOST data: ${enhancedFilename}`);
            console.log(`      Sending to Dossier Analysis...`);
            const analysisResponse = await this.callChatbase(JSON.stringify(enhancedData), this.chatbaseDossierAnalysisId, 'Dossier Analysis');
            let analysisJsonContent = analysisResponse;
            if (analysisResponse && analysisResponse.text) {
                try {
                    analysisJsonContent = JSON.parse(analysisResponse.text);
                }
                catch (error) {
                    console.warn(`      Warning: Could not parse Dossier Analysis text field as JSON`);
                    analysisJsonContent = analysisResponse;
                }
            }
            const analysisFilename = `7_dossier_analysis.json`;
            const analysisPath = path.join(fileFolder, analysisFilename);
            await fs.writeFile(analysisPath, JSON.stringify(analysisJsonContent, null, 2));
            console.log(`      Saved Dossier Analysis result: ${analysisFilename}`);
            return analysisPath;
        }
        catch (error) {
            console.error(`      [Dossier Analysis Error]:`, error);
            throw error;
        }
    }
    async generateFinalInterpretation(dossierAnalysisJsonPath, fileFolder) {
        try {
            console.log(`      Reading dossier_analysis.json...`);
            const analysisContent = await fs.readFile(dossierAnalysisJsonPath, 'utf-8');
            const analysisData = JSON.parse(analysisContent);
            console.log(`      Sending to Interprétation du dossier for final text...`);
            const interpretationResponse = await this.callChatbase(JSON.stringify(analysisData), this.chatbaseDossierInterpretationId, 'Interprétation du dossier (Final)');
            let textContent = '';
            if (interpretationResponse && typeof interpretationResponse === 'object' && interpretationResponse.text) {
                textContent = interpretationResponse.text;
            }
            else if (typeof interpretationResponse === 'string') {
                textContent = interpretationResponse;
            }
            else {
                textContent = JSON.stringify(interpretationResponse, null, 2);
            }
            const txtFilename = `8_interpretation_finale.txt`;
            const txtPath = path.join(fileFolder, txtFilename);
            await fs.writeFile(txtPath, textContent, 'utf-8');
            console.log(`      Saved final interpretation text: ${txtFilename}`);
            return txtPath;
        }
        catch (error) {
            console.error(`      [Final Interpretation Error]:`, error);
            throw error;
        }
    }
    generateChatbaseMessage(data, chatbotId) {
        const MAX_CHUNK_SIZE = 3000;
        const chunks = [];
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
        console.log(`        Sending ${chunks.length} chunk(s) (${data.length} total characters)`);
        return {
            messages: messages,
            chatbotId: chatbotId,
            stream: false,
        };
    }
    async callChatbase(textData, chatbotId, chatbotName) {
        return this.retryWithBackoff(async () => {
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
        }, `Chatbase ${chatbotName}`);
    }
    formatDuration(seconds) {
        const totalSeconds = parseFloat(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = (totalSeconds % 60).toFixed(2);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.padStart(5, '0')}`;
    }
    formatDurationFromNumber(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = (seconds % 60).toFixed(2);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.padStart(5, '0')}`;
    }
    generateBatchReport(fileResults, totalDuration, config) {
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
    generateExecutionReport(data) {
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
  Étape 8 - Génération du rapport final             : ${this.formatDuration(data.finalInterpretationDuration)}

┌──────────────────────────────────────────────────────────────────────────────┐
│ TEMPS TOTAL                                                                   │
└──────────────────────────────────────────────────────────────────────────────┘

  Durée totale du traitement                        : ${this.formatDuration(data.totalDuration)}

╔══════════════════════════════════════════════════════════════════════════════╗
║                              FIN DU RAPPORT                                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;
    }
    async listPdfFiles(folder) {
        let prefix = '';
        if (folder && folder.trim() !== '') {
            prefix = folder.endsWith('/') ? folder : `${folder}/`;
        }
        const command = new client_s3_1.ListObjectsV2Command({
            Bucket: this.bucketName,
            ...(prefix && { Prefix: prefix }),
        });
        const response = await this.s3Client.send(command);
        if (!response.Contents || response.Contents.length === 0) {
            return [];
        }
        return response.Contents.filter((item) => item.Key?.toLowerCase().endsWith('.pdf'))
            .map((item) => item.Key)
            .filter((key) => key !== undefined);
    }
};
exports.BatchService = BatchService;
exports.BatchService = BatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BatchService);
//# sourceMappingURL=batch.service.js.map