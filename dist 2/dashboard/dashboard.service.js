"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
let DashboardService = class DashboardService {
    getDashboard() {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="https://cdn.prod.website-files.com/684fc8bdc6e7edd505c58655/69147295c08d5fe3c86bbbf7_energer-logo_energer-default%20black.svg">
    <title>Energer - Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Header */
        .header {
            background: white;
            padding: 16px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-logo img {
            height: 32px;
        }

        .header-nav {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .header-nav a {
            color: #374151;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s;
        }

        .header-nav a:hover {
            color: #4d65ff;
        }

        .header-nav a.active {
            color: #4d65ff;
        }

        .header-user {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            background: #4d65ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 14px;
        }

        .btn-logout {
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            background: transparent;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-logout:hover {
            background: #f3f4f6;
            border-color: #d1d5db;
        }

        /* Main content */
        .main {
            flex: 1;
            padding: 32px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }

        /* Drop zone */
        .dropzone-card {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            margin-bottom: 24px;
        }

        .dropzone {
            border: 2px dashed #d1d5db;
            border-radius: 12px;
            padding: 24px 32px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
            background: #fafafa;
        }

        .dropzone:hover {
            border-color: #22c55e;
            background: #f0fdf4;
        }

        .dropzone.dragover {
            border-color: #22c55e;
            background: #f0fdf4;
            border-style: solid;
        }

        .dropzone-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 12px;
            background: #e5e7eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .dropzone:hover .dropzone-icon,
        .dropzone.dragover .dropzone-icon {
            background: #dcfce7;
        }

        .dropzone-icon svg {
            width: 22px;
            height: 22px;
            color: #6b7280;
        }

        .dropzone:hover .dropzone-icon svg,
        .dropzone.dragover .dropzone-icon svg {
            color: #22c55e;
        }

        .dropzone h3 {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
        }

        .dropzone p {
            font-size: 13px;
            color: #6b7280;
        }

        .dropzone input[type="file"] {
            display: none;
        }

        /* File list */
        .file-list {
            margin-top: 24px;
        }

        .file-list-title {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
        }

        .file-item {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 8px 10px;
            margin-bottom: 8px;
        }

        .file-item-header {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .file-icon {
            width: 24px;
            height: 24px;
            background: #e5e7eb;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .file-icon svg {
            width: 12px;
            height: 12px;
            color: #6b7280;
        }

        .file-info {
            flex: 1;
            min-width: 0;
        }

        .file-name {
            font-size: 12px;
            font-weight: 500;
            color: #111827;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .file-name.document-type {
            font-size: 13px;
            font-weight: 600;
            color: #4d65ff;
        }

        .file-original-name {
            font-size: 9px;
            color: #9ca3af;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 1px;
        }

        .file-size {
            font-size: 10px;
            color: #6b7280;
        }

        .file-progress {
            margin-top: 2px;
        }

        .progress-bar {
            height: 3px;
            background: #e5e7eb;
            border-radius: 2px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: #22c55e;
            border-radius: 3px;
            transition: width 0.3s ease;
        }

        .progress-text {
            font-size: 10px;
            color: #6b7280;
            margin-top: 2px;
            text-align: right;
        }

        .file-status {
            font-size: 10px;
            padding: 2px 5px;
            border-radius: 3px;
            font-weight: 500;
        }

        .file-status.uploading {
            background: #fef3c7;
            color: #d97706;
        }

        .file-status.complete {
            background: #dcfce7;
            color: #16a34a;
        }

        .file-status.error {
            background: #fee2e2;
            color: #dc2626;
        }

        .file-status.ocr {
            background: #dbeafe;
            color: #2563eb;
        }

        .file-status.extract {
            background: #fef3c7;
            color: #d97706;
        }

        /* Steps indicator */
        .steps-indicator {
            display: flex;
            gap: 4px;
            margin-top: 4px;
            font-size: 9px;
            color: #9ca3af;
        }

        .step {
            padding: 1px 4px;
            border-radius: 2px;
            background: #e5e7eb;
        }

        .step.active {
            background: #dbeafe;
            color: #2563eb;
        }

        .step.done {
            background: #dcfce7;
            color: #16a34a;
        }

        /* Accordion */
        .accordion {
            margin-top: 8px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
        }

        .accordion-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: #f9fafb;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            color: #374151;
            transition: background 0.2s;
        }

        .accordion-header:hover {
            background: #f3f4f6;
        }

        .accordion-header .arrow {
            transition: transform 0.2s;
        }

        .accordion-header.open .arrow {
            transform: rotate(180deg);
        }

        .accordion-content {
            display: none;
            padding: 12px;
            background: #1f2937;
            max-height: 300px;
            overflow-y: auto;
        }

        .accordion-content.open {
            display: block;
        }

        .accordion-content pre {
            color: #10b981;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 11px;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 0;
        }

        /* Results table */
        .results-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }

        .results-table th,
        .results-table td {
            padding: 6px 8px;
            text-align: left;
            border-bottom: 1px solid #374151;
        }

        .results-table th {
            color: #9ca3af;
            font-weight: 500;
            background: #111827;
        }

        .results-table td {
            color: #10b981;
        }

        .results-table tr:hover td {
            background: #1f2937;
        }

        /* Footer */
        .footer {
            background: white;
            padding: 24px 32px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
        }

        .footer p {
            font-size: 13px;
            color: #9ca3af;
        }

        .footer a {
            color: #4d65ff;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-logo">
            <img src="https://cdn.prod.website-files.com/684fc8bdc6e7edd505c58655/69147295c08d5fe3c86bbbf7_energer-logo_energer-default%20black.svg" alt="Energer">
        </div>
        <nav class="header-nav">
        </nav>
        <div class="header-user">
            <div class="user-avatar" id="userAvatar">D</div>
            <button class="btn-logout" onclick="logout()">Déconnexion</button>
        </div>
    </header>

    <main class="main">
        <div class="dropzone-card">
            <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
                <div class="dropzone-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <h3>Glissez-déposez vos fichiers ici</h3>
                <p>ou cliquez pour sélectionner des fichiers</p>
                <input type="file" id="fileInput" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg">
            </div>

            <div class="file-list" id="fileList" style="display: none;">
                <div class="file-list-title">Fichiers (<span id="fileCount">0</span>)</div>
                <div id="fileItems"></div>
            </div>

        </div>
    </main>

    <footer class="footer">
        <p>&copy; 2026 <a href="https://www.energer.ai" target="_blank">Energer.ai</a> - Quantum Of Trust</p>
    </footer>

    <script>
        // Check authentication
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/';
        }

        // Set user avatar initial
        try {
            const decoded = atob(token);
            const username = decoded.split(':')[0];
            document.getElementById('userAvatar').textContent = username.charAt(0).toUpperCase();
        } catch (e) {}

        function logout() {
            localStorage.removeItem('authToken');
            window.location.href = '/';
        }

        // File management
        const files = [];
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('fileInput');
        const fileList = document.getElementById('fileList');
        const fileItems = document.getElementById('fileItems');
        const fileCount = document.getElementById('fileCount');

        // Drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
        });

        dropzone.addEventListener('drop', (e) => {
            const droppedFiles = e.dataTransfer.files;
            handleFiles(droppedFiles);
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
            fileInput.value = '';
        });

        function handleFiles(newFiles) {
            Array.from(newFiles).forEach(file => {
                const fileId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                const fileData = {
                    id: fileId,
                    file: file,
                    name: file.name,
                    size: file.size,
                    progress: 0,
                    status: 'uploading',
                    document_uuid: null,
                    document_url: null
                };
                files.push(fileData);
                addFileToList(fileData);
                uploadFile(fileData);
            });
            updateFileList();
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function addFileToList(fileData) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.id = 'file-' + fileData.id;
            fileItem.innerHTML = \`
                <div class="file-item-header">
                    <div class="file-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div class="file-info">
                        <div class="file-name" id="filename-\${fileData.id}">\${fileData.name}</div>
                        <div class="file-original-name" id="original-filename-\${fileData.id}" style="display: none;"></div>
                        <div class="file-size">\${formatFileSize(fileData.size)}</div>
                        <div class="file-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progress-\${fileData.id}" style="width: 0%"></div>
                            </div>
                            <div class="steps-indicator">
                                <span class="step active" id="step-upload-\${fileData.id}">Upload</span>
                                <span class="step" id="step-ocr-\${fileData.id}">OCR</span>
                                <span class="step" id="step-extract-\${fileData.id}">Extraction</span>
                            </div>
                        </div>
                    </div>
                    <span class="file-status uploading" id="status-\${fileData.id}">Upload...</span>
                </div>
                <div class="accordion" id="accordion-ocr-\${fileData.id}" style="display: none;">
                    <div class="accordion-header" onclick="toggleAccordion('ocr-\${fileData.id}')">
                        <span>Résultat OCR</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="accordion-content" id="accordion-content-ocr-\${fileData.id}">
                        <pre id="ocr-result-\${fileData.id}"></pre>
                    </div>
                </div>
                <div class="accordion" id="accordion-extract-\${fileData.id}" style="display: none;">
                    <div class="accordion-header" onclick="toggleAccordion('extract-\${fileData.id}')">
                        <span>Champs extraits</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="accordion-content" id="accordion-content-extract-\${fileData.id}">
                        <div id="extract-result-\${fileData.id}"></div>
                    </div>
                </div>
            \`;
            fileItems.appendChild(fileItem);
        }

        function toggleAccordion(fileId) {
            const header = document.querySelector('#accordion-' + fileId + ' .accordion-header');
            const content = document.getElementById('accordion-content-' + fileId);
            header.classList.toggle('open');
            content.classList.toggle('open');
        }

        async function uploadFile(fileData) {
            const progressBar = document.getElementById('progress-' + fileData.id);
            const progressText = document.getElementById('progress-text-' + fileData.id);
            const statusEl = document.getElementById('status-' + fileData.id);

            try {
                const formData = new FormData();
                formData.append('file', fileData.file);

                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const progress = (e.loaded / e.total) * 100;
                        progressBar.style.width = progress + '%';
                        progressText.textContent = Math.round(progress) + '%';
                        fileData.progress = progress;
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        const response = JSON.parse(xhr.responseText);
                        fileData.document_uuid = response.document_uuid;
                        fileData.document_url = response.document_url;
                        fileData.s3_key = response.s3_key;
                        fileData.status = 'uploaded';

                        // Update progress and steps
                        progressBar.style.width = '33%';
                        updateSteps(fileData.id, 'ocr');
                        statusEl.textContent = 'OCR...';
                        statusEl.className = 'file-status ocr';

                        // Start OCR
                        startOcr(fileData);
                    } else {
                        throw new Error('Erreur upload');
                    }
                });

                xhr.addEventListener('error', () => {
                    fileData.status = 'error';
                    statusEl.textContent = 'Erreur';
                    statusEl.className = 'file-status error';
                });

                xhr.open('POST', '/api/upload');
                xhr.send(formData);

            } catch (error) {
                fileData.status = 'error';
                statusEl.textContent = 'Erreur';
                statusEl.className = 'file-status error';
            }
        }

        function updateSteps(fileId, currentStep) {
            const stepUpload = document.getElementById('step-upload-' + fileId);
            const stepOcr = document.getElementById('step-ocr-' + fileId);
            const stepExtract = document.getElementById('step-extract-' + fileId);

            stepUpload.className = 'step done';
            stepOcr.className = 'step';
            stepExtract.className = 'step';

            if (currentStep === 'ocr') {
                stepOcr.className = 'step active';
            } else if (currentStep === 'extract') {
                stepOcr.className = 'step done';
                stepExtract.className = 'step active';
            } else if (currentStep === 'done') {
                stepOcr.className = 'step done';
                stepExtract.className = 'step done';
            }
        }

        async function startOcr(fileData) {
            const statusEl = document.getElementById('status-' + fileData.id);
            const progressBar = document.getElementById('progress-' + fileData.id);
            const accordionOcr = document.getElementById('accordion-ocr-' + fileData.id);
            const ocrResult = document.getElementById('ocr-result-' + fileData.id);

            try {
                const response = await fetch('/api/ocr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        document_uuid: fileData.document_uuid,
                        document_url: fileData.document_url,
                        s3_key: fileData.s3_key
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    fileData.ocrText = result.text;

                    // Show OCR result
                    ocrResult.textContent = result.text;
                    accordionOcr.style.display = 'block';

                    // Update progress and steps for extraction
                    progressBar.style.width = '66%';
                    updateSteps(fileData.id, 'extract');
                    statusEl.textContent = 'Extraction...';
                    statusEl.className = 'file-status extract';

                    // Start extraction
                    startExtraction(fileData);
                } else {
                    throw new Error(result.message || 'Erreur OCR');
                }
            } catch (error) {
                fileData.status = 'error';
                statusEl.textContent = 'Erreur OCR';
                statusEl.className = 'file-status error';
            }
        }

        async function startExtraction(fileData) {
            const statusEl = document.getElementById('status-' + fileData.id);
            const progressBar = document.getElementById('progress-' + fileData.id);
            const accordionExtract = document.getElementById('accordion-extract-' + fileData.id);
            const extractResult = document.getElementById('extract-result-' + fileData.id);

            try {
                const response = await fetch('/api/extract', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        document_uuid: fileData.document_uuid,
                        ocr_text: fileData.ocrText
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    fileData.status = 'complete';
                    fileData.fields = result.fields;

                    // Update progress and steps
                    progressBar.style.width = '100%';
                    updateSteps(fileData.id, 'done');
                    statusEl.textContent = 'Terminé';
                    statusEl.className = 'file-status complete';

                    // Update filename with document type
                    updateFilenameWithDocType(fileData.id, fileData.name, result.fields);

                    // Display results as table
                    extractResult.innerHTML = renderFieldsAsTable(result.fields);
                    accordionExtract.style.display = 'block';
                } else {
                    throw new Error(result.message || 'Erreur extraction');
                }
            } catch (error) {
                fileData.status = 'error';
                statusEl.textContent = 'Erreur';
                statusEl.className = 'file-status error';
                extractResult.innerHTML = '<pre style="color: #ef4444;">Erreur: ' + error.message + '</pre>';
                accordionExtract.style.display = 'block';
            }
        }

        function updateFilenameWithDocType(fileId, originalName, fields) {
            const filenameEl = document.getElementById('filename-' + fileId);
            const originalFilenameEl = document.getElementById('original-filename-' + fileId);

            if (!fields || typeof fields !== 'object') return;

            // Look for document type in common field names
            const typeFields = ['type_document', 'document_type', 'type', 'documentType', 'Type de document', 'Type'];
            let documentType = null;

            for (const fieldName of typeFields) {
                if (fields[fieldName]) {
                    documentType = fields[fieldName];
                    break;
                }
            }

            if (documentType && filenameEl && originalFilenameEl) {
                filenameEl.textContent = documentType;
                filenameEl.classList.add('document-type');
                originalFilenameEl.textContent = originalName;
                originalFilenameEl.style.display = 'block';
            }
        }

        function renderFieldsAsTable(fields) {
            if (!fields || typeof fields !== 'object') {
                return '<pre>' + JSON.stringify(fields, null, 2) + '</pre>';
            }

            // If fields has a 'raw' property, show as pre
            if (fields.raw) {
                return '<pre>' + fields.raw + '</pre>';
            }

            // Build table from object
            let html = '<table class="results-table"><thead><tr><th>Champ</th><th>Valeur</th></tr></thead><tbody>';

            function addRows(obj, prefix = '') {
                for (const [key, value] of Object.entries(obj)) {
                    const fieldName = prefix ? prefix + '.' + key : key;
                    if (value && typeof value === 'object' && !Array.isArray(value)) {
                        addRows(value, fieldName);
                    } else {
                        const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
                        html += '<tr><td>' + fieldName + '</td><td>' + displayValue + '</td></tr>';
                    }
                }
            }

            addRows(fields);
            html += '</tbody></table>';
            return html;
        }

        function updateFileList() {
            fileCount.textContent = files.length;
            fileList.style.display = files.length > 0 ? 'block' : 'none';
        }
    </script>
</body>
</html>
    `;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)()
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map