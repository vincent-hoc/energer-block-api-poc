import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getDashboard(): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="https://cdn.prod.website-files.com/684fc8bdc6e7edd505c58655/69147295c08d5fe3c86bbbf7_energer-logo_energer-default%20black.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">
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

        /* Debug toggle */
        .debug-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-right: 16px;
        }

        .debug-label {
            font-size: 12px;
            color: #6b7280;
            font-weight: 500;
        }

        .toggle-switch {
            position: relative;
            width: 36px;
            height: 20px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #d1d5db;
            transition: 0.3s;
            border-radius: 20px;
        }

        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
        }

        .toggle-switch input:checked + .toggle-slider {
            background-color: #4d65ff;
        }

        .toggle-switch input:checked + .toggle-slider:before {
            transform: translateX(16px);
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

        /* Analyze button */
        .analyze-button-container {
            margin-top: 24px;
            text-align: center;
        }

        .btn-analyze {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 14px 28px;
            font-size: 15px;
            font-weight: 600;
            color: white;
            background: linear-gradient(135deg, #4d65ff 0%, #6366f1 100%);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(77, 101, 255, 0.3);
        }

        .btn-analyze:hover:not(:disabled) {
            background: linear-gradient(135deg, #3d55ef 0%, #5356e1 100%);
            box-shadow: 0 6px 16px rgba(77, 101, 255, 0.4);
            transform: translateY(-1px);
        }

        .btn-analyze:disabled {
            background: #d1d5db;
            color: #9ca3af;
            cursor: not-allowed;
            box-shadow: none;
        }

        .btn-analyze svg {
            flex-shrink: 0;
        }

        .analyze-hint {
            margin-top: 10px;
            font-size: 13px;
            color: #9ca3af;
            font-style: italic;
        }

        .analyze-hint.hidden {
            display: none;
        }

        .waiting-fost-message {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 16px;
            padding: 12px 16px;
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            color: #92400e;
            font-size: 14px;
        }

        .waiting-fost-message svg {
            flex-shrink: 0;
            color: #f59e0b;
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

        /* Analysis section */
        .analysis-section {
            background: linear-gradient(135deg, #e8ebff 0%, #f0f1ff 100%);
            border: 1px solid #c7d0ff;
            border-radius: 10px;
            padding: 16px 20px;
            margin-top: 20px;
            margin-bottom: 20px;
            display: none;
        }

        .analysis-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }

        .analysis-title {
            font-size: 14px;
            font-weight: 600;
            color: #4d65ff;
        }

        .analysis-subtitle {
            font-size: 11px;
            color: #6b7280;
            margin-top: 4px;
            display: none;
        }

        .analysis-subtitle.show {
            display: block;
        }

        .analysis-status {
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 500;
            background: #4d65ff;
            color: white;
        }

        .analysis-status.complete {
            background: #22c55e;
        }

        .analysis-status.error {
            background: #ef4444;
        }

        .analysis-progress {
            margin-bottom: 10px;
        }

        .analysis-progress-bar {
            height: 6px;
            background: #d1d5db;
            border-radius: 3px;
            overflow: hidden;
        }

        .analysis-progress-fill {
            height: 100%;
            background: #4d65ff;
            border-radius: 3px;
            transition: width 0.3s ease;
        }

        .analysis-steps {
            display: flex;
            gap: 8px;
        }

        .analysis-step {
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            background: #e5e7eb;
            color: #6b7280;
        }

        .analysis-step.active {
            background: #4d65ff;
            color: white;
        }

        .analysis-step.done {
            background: #22c55e;
            color: white;
        }

        .analysis-accordions {
            margin-top: 12px;
        }

        .analysis-accordion {
            margin-bottom: 6px;
            border-color: #c7d0ff;
        }

        .analysis-accordion .accordion-header {
            background: #f8f9ff;
            color: #374151;
        }

        .analysis-accordion .accordion-header:hover {
            background: #eef0ff;
        }

        .analysis-accordion .accordion-content {
            background: #ffffff;
        }

        .analysis-accordion .accordion-content pre {
            color: #374151;
        }

        /* Analysis result display */
        .analysis-result-display {
            margin-top: 16px;
            padding: 20px 24px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            display: none;
        }

        .analysis-result-display.show {
            display: block;
        }

        .analysis-result-display h4 {
            font-family: 'Rajdhani', sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #4d65ff;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .analysis-result-content {
            font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
        }

        .analysis-result-section {
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
        }

        .analysis-result-section:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        .analysis-result-label {
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .analysis-result-value {
            color: #374151;
        }

        .analysis-result-value.status-conforme {
            color: #16a34a;
            font-weight: 600;
        }

        .analysis-result-value.status-non-conforme {
            color: #dc2626;
            font-weight: 600;
        }

        .analysis-result-value.status-rejete {
            color: #f97316;
            font-weight: 600;
        }

        .analysis-result-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .analysis-result-list li {
            padding: 6px 0;
            border-bottom: 1px solid #f3f4f6;
        }

        .analysis-result-list li:last-child {
            border-bottom: none;
        }

        .analysis-result-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            margin-right: 4px;
            margin-bottom: 4px;
        }

        .analysis-result-badge.ok {
            background: #dcfce7;
            color: #16a34a;
        }

        .analysis-result-badge.missing {
            background: #fee2e2;
            color: #dc2626;
        }

        .analysis-result-badge.warning {
            background: #fef3c7;
            color: #d97706;
        }

        .interpretation-text {
            font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            line-height: 1.7;
            color: #374151;
            white-space: pre-wrap;
        }

        /* Conformity tag */
        .conformity-tag {
            display: none;
            margin-left: 16px;
            padding: 6px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .conformity-tag.show {
            display: inline-block;
        }

        .conformity-tag.conforme {
            background-color: #dcfce7;
            color: #166534;
            border: 1px solid #22c55e;
        }

        .conformity-tag.non-conforme {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #ef4444;
        }

        .conformity-tag.rejete {
            background-color: #ffedd5;
            color: #9a3412;
            border: 1px solid #f97316;
        }

        .analysis-section {
            position: relative;
        }

        .analysis-title-row {
            display: flex;
            align-items: center;
        }

        /* File-level conformity tag and analysis display */
        .file-status-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .file-conformity-tag {
            display: none;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .file-conformity-tag.show {
            display: inline-block;
        }

        .file-conformity-tag.conforme {
            background-color: #dcfce7;
            color: #166534;
            border: 1px solid #22c55e;
        }

        .file-conformity-tag.non-conforme {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #ef4444;
        }

        .file-conformity-tag.rejete {
            background-color: #ffedd5;
            color: #9a3412;
            border: 1px solid #f97316;
        }

        .file-analyse-accordion {
            margin-top: 8px;
        }

        .file-analyse-accordion .accordion-content {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-top: none;
        }

        .analyse-display-content {
            font-size: 12px;
            line-height: 1.5;
            color: #374151;
        }

        .analyse-display-content .analyse-field {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #f3f4f6;
        }

        .analyse-display-content .analyse-field:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        .analyse-display-content .analyse-label {
            font-weight: 600;
            color: #111827;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 2px;
        }

        .analyse-display-content .analyse-value {
            color: #374151;
        }

        .analyse-display-content .analyse-value.status-conforme {
            color: #16a34a;
            font-weight: 600;
        }

        .analyse-display-content .analyse-value.status-non-conforme {
            color: #dc2626;
            font-weight: 600;
        }

        .analyse-display-content .analyse-value.status-rejete {
            color: #f97316;
            font-weight: 600;
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
            <div class="debug-toggle">
                <span class="debug-label">Debug</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="debugToggle" onchange="toggleDebugMode()">
                    <span class="toggle-slider"></span>
                </label>
            </div>
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

            <div class="analysis-section" id="analysisSection">
                <div class="analysis-header">
                    <div>
                        <div class="analysis-title-row">
                            <span class="analysis-title">Analyse du dossier</span>
                            <span class="conformity-tag" id="conformityTag"></span>
                        </div>
                        <div class="analysis-subtitle" id="analysisSubtitle"></div>
                    </div>
                    <span class="analysis-status" id="analysisStatus">En attente...</span>
                </div>
                <div class="analysis-progress">
                    <div class="analysis-progress-bar">
                        <div class="analysis-progress-fill" id="analysisProgressFill" style="width: 0%"></div>
                    </div>
                </div>
                <div class="analysis-steps">
                    <span class="analysis-step" id="analysis-step-analyse">Analyse</span>
                    <span class="analysis-step" id="analysis-step-interpretation">Interprétation</span>
                </div>
                <div class="analysis-accordions">
                    <div class="accordion analysis-accordion" id="accordion-analysis-analyse" style="display: none;">
                        <div class="accordion-header" onclick="toggleAnalysisAccordion('analyse')">
                            <span>Résultat Analyse</span>
                            <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 9l6 6 6-6"/>
                            </svg>
                        </div>
                        <div class="accordion-content" id="accordion-content-analysis-analyse">
                            <pre id="analysis-analyse-result"></pre>
                        </div>
                    </div>
                    <div class="accordion analysis-accordion" id="accordion-analysis-interpretation" style="display: none;">
                        <div class="accordion-header" onclick="toggleAnalysisAccordion('interpretation')">
                            <span>Résultat Interprétation</span>
                            <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 9l6 6 6-6"/>
                            </svg>
                        </div>
                        <div class="accordion-content" id="accordion-content-analysis-interpretation">
                            <pre id="analysis-interpretation-result"></pre>
                        </div>
                    </div>
                </div>
                <div class="analysis-result-display" id="analysisResultDisplay">
                    <h4>Interprétation</h4>
                    <div class="analysis-result-content" id="analysisResultContent"></div>
                </div>
            </div>

            <div class="file-list" id="fileList" style="display: none;">
                <div class="file-list-title">Fichiers (<span id="fileCount">0</span>)</div>
                <div id="fileItems"></div>
                <div class="waiting-fost-message" id="waitingFostMessage" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>Veuillez déposer un devis pour identifier la FOST et finaliser l'analyse des fichiers en attente.</span>
                </div>
            </div>

            <div class="analyze-button-container" id="analyzeButtonContainer" style="display: none;">
                <button class="btn-analyze" id="btnAnalyze" disabled onclick="startDossierAnalysis()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Analyser le dossier
                </button>
                <p class="analyze-hint" id="analyzeHint">L'analyse n'est possible qu'en présence d'un devis</p>
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

        // Date formatting helper
        function formatDateToFrench(text) {
            if (!text) return text;
            // Match ISO dates (yyyy-mm-dd) and convert to dd/mm/yyyy
            return String(text).replace(/(\\d{4})-(\\d{2})-(\\d{2})/g, function(match, year, month, day) {
                return day + '/' + month + '/' + year;
            });
        }

        // Debug mode
        let debugMode = false;

        function toggleDebugMode() {
            debugMode = document.getElementById('debugToggle').checked;
            // Show/hide all accordions based on debug mode
            const accordions = document.querySelectorAll('.accordion');
            accordions.forEach(accordion => {
                // Only show if debug mode is on AND accordion has content
                if (debugMode && accordion.dataset.hasContent === 'true') {
                    accordion.style.display = 'block';
                } else {
                    accordion.style.display = 'none';
                }
            });

            // Also handle analysis accordions
            const analysisAccordions = document.querySelectorAll('.analysis-accordion');
            analysisAccordions.forEach(accordion => {
                if (debugMode && accordion.dataset.hasContent === 'true') {
                    accordion.style.display = 'block';
                } else {
                    accordion.style.display = 'none';
                }
            });
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
            // If analysis has already started, reset it for re-analysis
            if (analysisStarted) {
                resetAnalysis();
            }

            // Show button container and disable button while processing
            const analyzeButtonContainer = document.getElementById('analyzeButtonContainer');
            const btnAnalyze = document.getElementById('btnAnalyze');
            analyzeButtonContainer.style.display = 'block';
            btnAnalyze.disabled = true;

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

        function resetAnalysis() {
            console.log('[Analysis] Resetting analysis for new files');
            analysisStarted = false;

            // Stop any running progress animation
            if (window.progressAnimationInterval) {
                clearInterval(window.progressAnimationInterval);
                window.progressAnimationInterval = null;
            }

            // Reset analysis section UI
            const analysisSection = document.getElementById('analysisSection');
            const analysisStatus = document.getElementById('analysisStatus');
            const analysisProgressFill = document.getElementById('analysisProgressFill');
            const analysisSubtitle = document.getElementById('analysisSubtitle');
            const conformityTag = document.getElementById('conformityTag');
            const analysisResultDisplay = document.getElementById('analysisResultDisplay');

            // Reset progress bar and status
            analysisProgressFill.style.width = '0%';
            analysisStatus.textContent = 'En attente...';
            analysisStatus.className = 'analysis-status';

            // Hide subtitle and tag
            analysisSubtitle.classList.remove('show');
            analysisSubtitle.textContent = '';
            conformityTag.className = 'conformity-tag';
            conformityTag.textContent = '';

            // Hide analysis result display
            analysisResultDisplay.classList.remove('show');
            document.getElementById('analysisResultContent').innerHTML = '';

            // Reset steps
            updateAnalysisStep('');

            // Reset and hide accordions
            const accordionAnalyse = document.getElementById('accordion-analysis-analyse');
            const accordionInterpretation = document.getElementById('accordion-analysis-interpretation');

            if (accordionAnalyse) {
                accordionAnalyse.style.display = 'none';
                accordionAnalyse.dataset.hasContent = 'false';
                document.getElementById('analysis-analyse-result').textContent = '';
            }

            if (accordionInterpretation) {
                accordionInterpretation.style.display = 'none';
                accordionInterpretation.dataset.hasContent = 'false';
                document.getElementById('analysis-interpretation-result').textContent = '';
            }

            // Keep section visible while processing new files
            analysisSection.style.display = 'block';
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
                                <span class="step" id="step-fost-\${fileData.id}" style="display: none;">FOST</span>
                                <span class="step" id="step-waiting-fost-\${fileData.id}" style="display: none;">Attente FOST</span>
                                <span class="step" id="step-analyse-\${fileData.id}" style="display: none;">Analyse</span>
                            </div>
                        </div>
                    </div>
                    <div class="file-status-container">
                        <span class="file-status uploading" id="status-\${fileData.id}">Upload...</span>
                        <span class="file-conformity-tag" id="file-tag-\${fileData.id}"></span>
                    </div>
                </div>
                <div class="accordion file-analyse-accordion" id="accordion-analyse-display-\${fileData.id}" style="display: none;">
                    <div class="accordion-header" onclick="toggleAccordion('analyse-display-\${fileData.id}')">
                        <span>Résultat de l'analyse</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="accordion-content" id="accordion-content-analyse-display-\${fileData.id}">
                        <div id="analyse-display-\${fileData.id}" class="analyse-display-content"></div>
                    </div>
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
                <div class="accordion" id="accordion-fost-\${fileData.id}" style="display: none;">
                    <div class="accordion-header" onclick="toggleAccordion('fost-\${fileData.id}')">
                        <span>FOST identifiée</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="accordion-content" id="accordion-content-fost-\${fileData.id}">
                        <div id="fost-result-\${fileData.id}"></div>
                    </div>
                </div>
                <div class="accordion" id="accordion-analyse-\${fileData.id}" style="display: none;">
                    <div class="accordion-header" onclick="toggleAccordion('analyse-\${fileData.id}')">
                        <span>Analyse (debug)</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="accordion-content" id="accordion-content-analyse-\${fileData.id}">
                        <div id="analyse-result-\${fileData.id}"></div>
                    </div>
                </div>
            \`;
            fileItems.insertBefore(fileItem, fileItems.firstChild);
        }

        function toggleAccordion(fileId) {
            const header = document.querySelector('#accordion-' + fileId + ' .accordion-header');
            const content = document.getElementById('accordion-content-' + fileId);
            header.classList.toggle('open');
            content.classList.toggle('open');
        }

        function toggleAnalysisAccordion(type) {
            const header = document.querySelector('#accordion-analysis-' + type + ' .accordion-header');
            const content = document.getElementById('accordion-content-analysis-' + type);
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

        function updateSteps(fileId, currentStep, isDevis = null) {
            const stepUpload = document.getElementById('step-upload-' + fileId);
            const stepOcr = document.getElementById('step-ocr-' + fileId);
            const stepExtract = document.getElementById('step-extract-' + fileId);
            const stepFost = document.getElementById('step-fost-' + fileId);
            const stepWaitingFost = document.getElementById('step-waiting-fost-' + fileId);
            const stepAnalyse = document.getElementById('step-analyse-' + fileId);

            stepUpload.className = 'step done';
            stepOcr.className = 'step';
            stepExtract.className = 'step';
            stepFost.className = 'step';
            stepWaitingFost.className = 'step';
            stepAnalyse.className = 'step';

            // Show appropriate steps based on file type (only after extraction)
            if (isDevis === true) {
                // DEVIS: Upload → OCR → Extraction → FOST → Analyse
                stepFost.style.display = 'inline';
                stepWaitingFost.style.display = 'none';
                stepAnalyse.style.display = 'inline';
            } else if (isDevis === false) {
                // Other files: Upload → OCR → Extraction → Attente FOST → Analyse
                stepFost.style.display = 'none';
                stepWaitingFost.style.display = 'inline';
                stepAnalyse.style.display = 'inline';
            }
            // If isDevis is null, keep the optional steps hidden (early stages)

            if (currentStep === 'ocr') {
                stepOcr.className = 'step active';
            } else if (currentStep === 'extract') {
                stepOcr.className = 'step done';
                stepExtract.className = 'step active';
            } else if (currentStep === 'fost') {
                stepOcr.className = 'step done';
                stepExtract.className = 'step done';
                stepFost.className = 'step active';
            } else if (currentStep === 'waiting-fost') {
                stepOcr.className = 'step done';
                stepExtract.className = 'step done';
                stepWaitingFost.className = 'step active';
            } else if (currentStep === 'analyse') {
                stepOcr.className = 'step done';
                stepExtract.className = 'step done';
                if (isDevis) {
                    stepFost.className = 'step done';
                } else {
                    stepWaitingFost.className = 'step done';
                }
                stepAnalyse.className = 'step active';
            } else if (currentStep === 'done') {
                stepOcr.className = 'step done';
                stepExtract.className = 'step done';
                if (isDevis) {
                    stepFost.className = 'step done';
                } else {
                    stepWaitingFost.className = 'step done';
                }
                stepAnalyse.className = 'step done';
            }
        }

        // File progress animation helpers
        const fileProgressIntervals = {};
        const fileProgressValues = {};

        function animateFileProgressTo(fileId, targetPercent, duration = 10000) {
            const progressBar = document.getElementById('progress-' + fileId);
            if (!progressBar) return;

            const startProgress = fileProgressValues[fileId] || 0;
            const increment = (targetPercent - startProgress) / (duration / 100);

            // Clear any existing animation for this file
            if (fileProgressIntervals[fileId]) {
                clearInterval(fileProgressIntervals[fileId]);
            }

            fileProgressIntervals[fileId] = setInterval(() => {
                fileProgressValues[fileId] = (fileProgressValues[fileId] || startProgress) + increment;
                if ((increment > 0 && fileProgressValues[fileId] >= targetPercent) ||
                    (increment < 0 && fileProgressValues[fileId] <= targetPercent)) {
                    fileProgressValues[fileId] = targetPercent;
                    clearInterval(fileProgressIntervals[fileId]);
                    fileProgressIntervals[fileId] = null;
                }
                progressBar.style.width = fileProgressValues[fileId] + '%';
            }, 100);
        }

        function stopFileProgressAnimation(fileId) {
            if (fileProgressIntervals[fileId]) {
                clearInterval(fileProgressIntervals[fileId]);
                fileProgressIntervals[fileId] = null;
            }
        }

        function setFileProgressImmediate(fileId, percent) {
            stopFileProgressAnimation(fileId);
            fileProgressValues[fileId] = percent;
            const progressBar = document.getElementById('progress-' + fileId);
            if (progressBar) {
                progressBar.style.width = percent + '%';
            }
        }

        async function startOcr(fileData) {
            const statusEl = document.getElementById('status-' + fileData.id);
            const accordionOcr = document.getElementById('accordion-ocr-' + fileData.id);
            const ocrResult = document.getElementById('ocr-result-' + fileData.id);

            // Start animating progress during OCR
            setFileProgressImmediate(fileData.id, 33);
            animateFileProgressTo(fileData.id, 60, 30000); // Animate towards 60% over 30s

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

                    // Show OCR result (only if debug mode is on)
                    ocrResult.textContent = result.text;
                    accordionOcr.dataset.hasContent = 'true';
                    if (debugMode) {
                        accordionOcr.style.display = 'block';
                    }

                    // Update progress and steps for extraction
                    setFileProgressImmediate(fileData.id, 66);
                    updateSteps(fileData.id, 'extract');
                    statusEl.textContent = 'Extraction...';
                    statusEl.className = 'file-status extract';

                    // Start extraction
                    startExtraction(fileData);
                } else {
                    throw new Error(result.message || 'Erreur OCR');
                }
            } catch (error) {
                stopFileProgressAnimation(fileData.id);
                fileData.status = 'error';
                statusEl.textContent = 'Erreur OCR';
                statusEl.className = 'file-status error';
            }
        }

        async function startExtraction(fileData) {
            const statusEl = document.getElementById('status-' + fileData.id);
            const accordionExtract = document.getElementById('accordion-extract-' + fileData.id);
            const extractResult = document.getElementById('extract-result-' + fileData.id);

            // Start animating progress during extraction
            animateFileProgressTo(fileData.id, 95, 20000); // Animate towards 95% over 20s

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
                    fileData.fields = result.fields;

                    // Update filename with document type
                    updateFilenameWithDocType(fileData.id, fileData.name, result.fields);

                    // Display results as table (only if debug mode is on)
                    extractResult.innerHTML = renderFieldsAsTable(result.fields);
                    accordionExtract.dataset.hasContent = 'true';
                    if (debugMode) {
                        accordionExtract.style.display = 'block';
                    }

                    // Check if document is a DEVIS - if so, call FOST identification
                    const typeDoc = result.fields?.type_doc || '';
                    const isDevis = typeDoc.toLowerCase().includes('devis');
                    fileData.isDevis = isDevis;

                    if (isDevis) {
                        // Show FOST step and start FOST identification
                        setFileProgressImmediate(fileData.id, 85);
                        updateSteps(fileData.id, 'fost', true);
                        statusEl.textContent = 'FOST...';
                        statusEl.className = 'file-status ocr';
                        animateFileProgressTo(fileData.id, 98, 15000);

                        // Call FOST identification for this DEVIS
                        await identifyFostForDevis(fileData, statusEl);

                        // After FOST is identified, process any waiting files
                        await processWaitingFiles();
                    } else {
                        // Non-DEVIS: wait for FOST to be available
                        fileData.status = 'waiting_fost';
                        setFileProgressImmediate(fileData.id, 75);
                        updateSteps(fileData.id, 'waiting-fost', false);
                        statusEl.textContent = 'Attente FOST...';
                        statusEl.className = 'file-status ocr';

                        // Check if FOST is already available from a DEVIS
                        const availableFost = getAvailableFost();
                        if (availableFost) {
                            await analyzeFileWithFost(fileData, statusEl, availableFost);
                        }
                    }

                    // Check if all files are complete
                    checkAllFilesComplete();
                } else {
                    throw new Error(result.message || 'Erreur extraction');
                }
            } catch (error) {
                stopFileProgressAnimation(fileData.id);
                fileData.status = 'error';
                statusEl.textContent = 'Erreur';
                statusEl.className = 'file-status error';
                extractResult.innerHTML = '<pre style="color: #ef4444;">Erreur: ' + error.message + '</pre>';
                accordionExtract.dataset.hasContent = 'true';
                if (debugMode) {
                    accordionExtract.style.display = 'block';
                }
            }
        }

        async function identifyFostForDevis(fileData, statusEl) {
            try {
                const docData = {
                    document_uuid: fileData.document_uuid,
                    filename: fileData.name,
                    type_doc: fileData.fields.type_doc,
                    fields: fileData.fields
                };

                const fostResponse = await fetch('/api/dossier/fost', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ documents: [docData] })
                });

                if (fostResponse.ok) {
                    const fostResult = await fostResponse.json();
                    fileData.fost = fostResult.fosts;
                    console.log('[FOST] Identified for DEVIS:', fileData.fost);

                    // Populate FOST accordion
                    const accordionFost = document.getElementById('accordion-fost-' + fileData.id);
                    const fostResultEl = document.getElementById('fost-result-' + fileData.id);
                    console.log('[Debug] accordionFost:', accordionFost, 'fostResultEl:', fostResultEl, 'debugMode:', debugMode);
                    if (accordionFost && fostResultEl) {
                        fostResultEl.innerHTML = '<pre>' + JSON.stringify(fileData.fost, null, 2) + '</pre>';
                        accordionFost.dataset.hasContent = 'true';
                        if (debugMode) {
                            accordionFost.style.display = 'block';
                        }
                        console.log('[Debug] FOST accordion populated');
                    }

                    // Analyse du fichier avec les champs et la FOST
                    updateSteps(fileData.id, 'analyse', true);
                    statusEl.textContent = 'Analyse...';
                    animateFileProgressTo(fileData.id, 95, 15000);

                    try {
                        const analyseResponse = await fetch('/api/dossier/ocode', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                fields: fileData.fields,
                                fost: fileData.fost
                            })
                        });

                        if (analyseResponse.ok) {
                            const analyseResult = await analyseResponse.json();
                            fileData.analyse = analyseResult.ocode;
                            console.log('[Analyse] Analyse complete for DEVIS:', fileData.analyse);

                            // Display human-readable analysis and tag
                            displayFileAnalyseResult(fileData.id, fileData.analyse);

                            // Populate debug Analyse accordion
                            const accordionAnalyse = document.getElementById('accordion-analyse-' + fileData.id);
                            const analyseResultEl = document.getElementById('analyse-result-' + fileData.id);
                            console.log('[Debug] accordionAnalyse:', accordionAnalyse, 'analyseResultEl:', analyseResultEl);
                            if (accordionAnalyse && analyseResultEl) {
                                analyseResultEl.innerHTML = '<pre>' + JSON.stringify(fileData.analyse, null, 2) + '</pre>';
                                accordionAnalyse.dataset.hasContent = 'true';
                                if (debugMode) {
                                    accordionAnalyse.style.display = 'block';
                                }
                                console.log('[Debug] Analyse accordion populated');
                            }
                        }
                    } catch (analyseError) {
                        console.error('[Analyse Error]:', analyseError);
                    }

                    stopFileProgressAnimation(fileData.id);
                }

                // Mark as complete regardless of FOST/Analyse result
                fileData.status = 'complete';
                setFileProgressImmediate(fileData.id, 100);
                updateSteps(fileData.id, 'done', true);
                statusEl.textContent = 'Terminé';
                statusEl.className = 'file-status complete';

            } catch (error) {
                console.error('[FOST Error]:', error);
                // Still mark as complete even if FOST fails
                fileData.status = 'complete';
                setFileProgressImmediate(fileData.id, 100);
                updateSteps(fileData.id, 'done', true);
                statusEl.textContent = 'Terminé';
                statusEl.className = 'file-status complete';
            }
        }

        // Get FOST from any completed DEVIS file
        function getAvailableFost() {
            const devisFile = files.find(f =>
                f.isDevis &&
                f.status === 'complete' &&
                f.fost
            );
            return devisFile ? devisFile.fost : null;
        }

        // Process all files waiting for FOST
        async function processWaitingFiles() {
            const fost = getAvailableFost();
            if (!fost) return;

            const waitingFiles = files.filter(f => f.status === 'waiting_fost');
            console.log('[Analyse] Processing', waitingFiles.length, 'waiting files with FOST');

            for (const fileData of waitingFiles) {
                const statusEl = document.getElementById('status-' + fileData.id);
                if (statusEl) {
                    await analyzeFileWithFost(fileData, statusEl, fost);
                }
            }

            checkAllFilesComplete();
        }

        // Analyze a non-DEVIS file with the provided FOST
        async function analyzeFileWithFost(fileData, statusEl, fost) {
            try {
                updateSteps(fileData.id, 'analyse', false);
                statusEl.textContent = 'Analyse...';
                statusEl.className = 'file-status ocr';
                animateFileProgressTo(fileData.id, 95, 15000);

                const analyseResponse = await fetch('/api/dossier/ocode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fields: fileData.fields,
                        fost: fost
                    })
                });

                if (analyseResponse.ok) {
                    const analyseResult = await analyseResponse.json();
                    fileData.analyse = analyseResult.ocode;
                    console.log('[Analyse] Analyse complete for file:', fileData.name);

                    // Display human-readable analysis and tag
                    displayFileAnalyseResult(fileData.id, fileData.analyse);

                    // Populate debug Analyse accordion
                    const accordionAnalyse = document.getElementById('accordion-analyse-' + fileData.id);
                    const analyseResultEl = document.getElementById('analyse-result-' + fileData.id);
                    if (analyseResultEl && fileData.analyse) {
                        analyseResultEl.innerHTML = '<pre>' + JSON.stringify(fileData.analyse, null, 2) + '</pre>';
                        accordionAnalyse.dataset.hasContent = 'true';
                        if (debugMode) {
                            accordionAnalyse.style.display = 'block';
                        }
                    }
                }

                stopFileProgressAnimation(fileData.id);
                fileData.status = 'complete';
                setFileProgressImmediate(fileData.id, 100);
                updateSteps(fileData.id, 'done', false);
                statusEl.textContent = 'Terminé';
                statusEl.className = 'file-status complete';

            } catch (error) {
                console.error('[Analyse Error]:', error);
                stopFileProgressAnimation(fileData.id);
                fileData.status = 'complete';
                setFileProgressImmediate(fileData.id, 100);
                updateSteps(fileData.id, 'done', false);
                statusEl.textContent = 'Terminé';
                statusEl.className = 'file-status complete';
            }
        }

        function updateFilenameWithDocType(fileId, originalName, fields) {
            const filenameEl = document.getElementById('filename-' + fileId);
            const originalFilenameEl = document.getElementById('original-filename-' + fileId);

            if (!fields || !fields.type_doc) return;

            if (filenameEl && originalFilenameEl) {
                filenameEl.textContent = fields.type_doc;
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

            function formatValue(value) {
                if (value === null || value === undefined) {
                    return '';
                }
                if (typeof value !== 'object') {
                    return String(value);
                }
                if (Array.isArray(value)) {
                    // Check if array contains objects
                    if (value.length > 0 && typeof value[0] === 'object') {
                        return JSON.stringify(value, null, 2);
                    }
                    return value.join(', ');
                }
                return JSON.stringify(value, null, 2);
            }

            function addRows(obj, prefix = '') {
                for (const [key, value] of Object.entries(obj)) {
                    const fieldName = prefix ? prefix + '.' + key : key;

                    if (value === null || value === undefined) {
                        html += '<tr><td>' + fieldName + '</td><td></td></tr>';
                    } else if (Array.isArray(value)) {
                        // Handle arrays
                        if (value.length > 0 && typeof value[0] === 'object') {
                            // Array of objects - add each item with index
                            value.forEach((item, index) => {
                                if (typeof item === 'object') {
                                    addRows(item, fieldName + '[' + index + ']');
                                } else {
                                    html += '<tr><td>' + fieldName + '[' + index + ']</td><td>' + String(item) + '</td></tr>';
                                }
                            });
                        } else {
                            // Simple array - join values
                            html += '<tr><td>' + fieldName + '</td><td>' + value.join(', ') + '</td></tr>';
                        }
                    } else if (typeof value === 'object') {
                        // Nested object - recurse
                        addRows(value, fieldName);
                    } else {
                        // Simple value
                        html += '<tr><td>' + fieldName + '</td><td>' + String(value) + '</td></tr>';
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

        // Analysis phase
        let analysisStarted = false;

        function checkAllFilesComplete() {
            const btnAnalyze = document.getElementById('btnAnalyze');
            const analyzeHint = document.getElementById('analyzeHint');
            const waitingFostMessage = document.getElementById('waitingFostMessage');
            const completeFiles = files.filter(f => f.status === 'complete');
            const errorFiles = files.filter(f => f.status === 'error');
            const waitingFostFiles = files.filter(f => f.status === 'waiting_fost');

            // Check if at least one DEVIS document exists
            const hasDevis = completeFiles.some(f => {
                const typeDoc = f.fields?.type_doc || '';
                return typeDoc.toLowerCase().includes('devis');
            });

            // Check if there are files waiting for FOST and no FOST available
            const allFilesProcessed = (completeFiles.length + errorFiles.length + waitingFostFiles.length) === files.length && files.length > 0;

            // Show waiting FOST message if files are waiting and no DEVIS with FOST
            if (waitingFostFiles.length > 0 && allFilesProcessed && !hasDevis) {
                waitingFostMessage.style.display = 'flex';
            } else {
                waitingFostMessage.style.display = 'none';
            }

            // All files fully processed (complete or error, not waiting)
            if (completeFiles.length + errorFiles.length === files.length && files.length > 0) {
                // Enable button only if at least one file completed AND there's a DEVIS
                if (completeFiles.length > 0 && hasDevis && !analysisStarted) {
                    btnAnalyze.disabled = false;
                    analyzeHint.classList.add('hidden');
                } else if (!hasDevis) {
                    btnAnalyze.disabled = true;
                    analyzeHint.classList.remove('hidden');
                }
            } else {
                // Still processing, keep button disabled
                btnAnalyze.disabled = true;
            }
        }

        // Smooth progress animation helper
        let currentProgress = 0;
        function animateProgressTo(targetPercent, duration = 5000) {
            const analysisProgressFill = document.getElementById('analysisProgressFill');
            const startProgress = currentProgress;
            const increment = (targetPercent - startProgress) / (duration / 100);

            // Clear any existing animation
            if (window.progressAnimationInterval) {
                clearInterval(window.progressAnimationInterval);
            }

            window.progressAnimationInterval = setInterval(() => {
                currentProgress += increment;
                if ((increment > 0 && currentProgress >= targetPercent) ||
                    (increment < 0 && currentProgress <= targetPercent)) {
                    currentProgress = targetPercent;
                    clearInterval(window.progressAnimationInterval);
                    window.progressAnimationInterval = null;
                }
                analysisProgressFill.style.width = currentProgress + '%';
            }, 100);
        }

        function stopProgressAnimation() {
            if (window.progressAnimationInterval) {
                clearInterval(window.progressAnimationInterval);
                window.progressAnimationInterval = null;
            }
        }

        function setProgressImmediate(percent) {
            stopProgressAnimation();
            currentProgress = percent;
            document.getElementById('analysisProgressFill').style.width = percent + '%';
        }

        async function startDossierAnalysis() {
            // Mark analysis as started and disable button
            analysisStarted = true;
            const btnAnalyze = document.getElementById('btnAnalyze');
            btnAnalyze.disabled = true;

            const analysisSection = document.getElementById('analysisSection');
            const analysisStatus = document.getElementById('analysisStatus');

            // Accordions
            const accordionAnalyse = document.getElementById('accordion-analysis-analyse');
            const accordionInterpretation = document.getElementById('accordion-analysis-interpretation');
            const analyseResultEl = document.getElementById('analysis-analyse-result');
            const interpretationResultEl = document.getElementById('analysis-interpretation-result');

            // Show analysis section
            analysisSection.style.display = 'block';
            currentProgress = 0;

            // Aggregate all extracted fields
            const documents = files
                .filter(f => f.status === 'complete' && f.fields)
                .map(f => ({
                    document_uuid: f.document_uuid,
                    filename: f.name,
                    type_doc: f.fields.type_doc || 'Unknown',
                    fields: f.fields
                }));

            // Get FOST from DEVIS file (already identified at file level)
            const devisFile = files.find(f =>
                f.status === 'complete' &&
                f.fields?.type_doc?.toLowerCase().includes('devis') &&
                f.fost
            );
            const fosts = devisFile?.fost || null;

            try {
                console.log('[Dossier] Starting analysis...');
                console.log('[Dossier] Documents:', documents);
                console.log('[Dossier] FOSTs:', fosts);

                // Display FOST in subtitle (from DEVIS file)
                const analysisSubtitle = document.getElementById('analysisSubtitle');
                if (fosts) {
                    let fostText = '';
                    if (Array.isArray(fosts)) {
                        fostText = fosts.join(', ');
                    } else if (typeof fosts === 'string') {
                        fostText = fosts;
                    } else if (fosts.raw) {
                        fostText = fosts.raw;
                    } else {
                        fostText = JSON.stringify(fosts);
                    }
                    // Format dates to dd/mm/yyyy
                    analysisSubtitle.textContent = formatDateToFrench(fostText);
                    analysisSubtitle.classList.add('show');
                }

                console.log('[Dossier] Step 1: Analyse API call...');

                // Step 1: Analyse
                setProgressImmediate(5);
                updateAnalysisStep('analyse');
                analysisStatus.textContent = 'Analyse en cours...';
                animateProgressTo(45, 20000); // Animate slowly towards 45% over 20s

                const analyseResponse = await fetch('/api/dossier/analyse', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ documents, fosts: fosts })
                });

                console.log('[Dossier] Analyse response status:', analyseResponse.status);
                if (!analyseResponse.ok) throw new Error('Erreur analyse: ' + analyseResponse.status);
                const analyseResult = await analyseResponse.json();
                console.log('[Dossier] Analyse result:', analyseResult);

                // Populate Analyse accordion
                analyseResultEl.textContent = JSON.stringify(analyseResult.analyse, null, 2);
                accordionAnalyse.dataset.hasContent = 'true';
                if (debugMode) {
                    accordionAnalyse.style.display = 'block';
                }

                // Show conformity tag based on global_status
                const conformityTag = document.getElementById('conformityTag');
                const globalStatus = analyseResult.analyse?.global_status
                    || analyseResult.analyse?.status
                    || analyseResult.global_status
                    || analyseResult.status
                    || (typeof analyseResult.analyse === 'object' ? JSON.stringify(analyseResult.analyse) : '');

                console.log('[Tag] globalStatus:', globalStatus);

                if (globalStatus) {
                    const statusLower = String(globalStatus).toLowerCase().replace(/_/g, ' ');

                    if (statusLower.includes('rejet')) {
                        conformityTag.textContent = 'Rejeté';
                        conformityTag.className = 'conformity-tag rejete show';
                    } else if (statusLower.includes('non') && statusLower.includes('conforme')) {
                        conformityTag.textContent = 'Non conforme';
                        conformityTag.className = 'conformity-tag non-conforme show';
                    } else if (statusLower.includes('conforme')) {
                        conformityTag.textContent = 'Conforme';
                        conformityTag.className = 'conformity-tag conforme show';
                    }
                }

                // Step 2: Interprétation
                setProgressImmediate(50);
                updateAnalysisStep('interpretation');
                analysisStatus.textContent = 'Interprétation...';
                animateProgressTo(95, 15000); // Animate slowly towards 95% over 15s

                const interpretResponse = await fetch('/api/dossier/interpretation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ analyse: analyseResult.analyse })
                });

                if (!interpretResponse.ok) throw new Error('Erreur interprétation');
                const interpretResult = await interpretResponse.json();

                // Populate Interpretation accordion
                const interpretText = typeof interpretResult.interpretation === 'string'
                    ? interpretResult.interpretation
                    : JSON.stringify(interpretResult.interpretation, null, 2);
                interpretationResultEl.textContent = interpretText;
                accordionInterpretation.dataset.hasContent = 'true';
                if (debugMode) {
                    accordionInterpretation.style.display = 'block';
                }

                // Display interpretation result
                const analysisResultDisplay = document.getElementById('analysisResultDisplay');
                const analysisResultContent = document.getElementById('analysisResultContent');
                analysisResultContent.innerHTML = '<div class="interpretation-text">' + interpretText.replace(/\\n/g, '<br>') + '</div>';
                analysisResultDisplay.classList.add('show');

                // Complete
                setProgressImmediate(100);
                updateAnalysisStep('done');
                analysisStatus.textContent = 'Terminé';
                analysisStatus.className = 'analysis-status complete';

            } catch (error) {
                console.error('[Analyse Dossier Error]:', error);
                stopProgressAnimation();
                analysisStatus.textContent = 'Erreur: ' + (error.message || 'Erreur inconnue');
                analysisStatus.className = 'analysis-status error';
            }
        }

        function updateAnalysisStep(currentStep) {
            const stepAnalyse = document.getElementById('analysis-step-analyse');
            const stepInterpretation = document.getElementById('analysis-step-interpretation');

            // Reset all steps to default
            stepAnalyse.className = 'analysis-step';
            stepInterpretation.className = 'analysis-step';

            // Empty string = reset state (all steps inactive)
            if (!currentStep || currentStep === '') {
                return;
            }

            if (currentStep === 'analyse') {
                stepAnalyse.className = 'analysis-step active';
            } else if (currentStep === 'interpretation') {
                stepAnalyse.className = 'analysis-step done';
                stepInterpretation.className = 'analysis-step active';
            } else if (currentStep === 'done') {
                stepAnalyse.className = 'analysis-step done';
                stepInterpretation.className = 'analysis-step done';
            }
        }

        // Helper function to format file-level analysis for human display
        function formatFileAnalyseDisplay(analyse) {
            if (!analyse || typeof analyse !== 'object') {
                if (typeof analyse === 'string') {
                    return '<div class="analyse-field"><div class="analyse-value">' + analyse + '</div></div>';
                }
                return '<pre>' + JSON.stringify(analyse, null, 2) + '</pre>';
            }

            // Helper to format field label
            function formatLabel(key) {
                return key
                    .replace(/_/g, ' ')
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
                    .toLowerCase()
                    .replace(/^./, str => str.toUpperCase());
            }

            // Helper to get status class
            function getStatusClass(value) {
                const valueLower = String(value).toLowerCase().replace(/_/g, ' ');
                if (valueLower.includes('rejet')) return 'status-rejete';
                if (valueLower.includes('non') && valueLower.includes('conforme')) return 'status-non-conforme';
                if (valueLower.includes('conforme')) return 'status-conforme';
                return '';
            }

            let html = '';

            for (const [key, value] of Object.entries(analyse)) {
                html += '<div class="analyse-field">';
                html += '<div class="analyse-label">' + formatLabel(key) + '</div>';

                if (value === null || value === undefined) {
                    html += '<div class="analyse-value">-</div>';
                } else if (Array.isArray(value)) {
                    if (value.length === 0) {
                        html += '<div class="analyse-value">Aucun</div>';
                    } else if (typeof value[0] === 'object') {
                        html += '<ul class="analyse-value" style="margin: 0; padding-left: 16px;">';
                        value.forEach(item => {
                            html += '<li>' + (typeof item === 'object' ? JSON.stringify(item) : item) + '</li>';
                        });
                        html += '</ul>';
                    } else {
                        html += '<div class="analyse-value">' + value.join(', ') + '</div>';
                    }
                } else if (typeof value === 'object') {
                    html += '<div class="analyse-value">' + JSON.stringify(value) + '</div>';
                } else {
                    const keyLower = key.toLowerCase();
                    const statusClass = (keyLower.includes('status') || keyLower.includes('statut')) ? getStatusClass(value) : '';
                    html += '<div class="analyse-value ' + statusClass + '">' + String(value).replace(/_/g, ' ') + '</div>';
                }

                html += '</div>';
            }

            return html || '<div class="analyse-field"><div class="analyse-value">Aucune donnée</div></div>';
        }

        // Helper function to extract conformity status from analysis
        function extractFileConformityStatus(analyse) {
            if (!analyse) return null;

            // Try to find a status field
            const statusKeys = ['status', 'statut', 'global_status', 'conformite', 'conformity'];
            for (const key of statusKeys) {
                if (analyse[key]) {
                    const statusLower = String(analyse[key]).toLowerCase().replace(/_/g, ' ');
                    if (statusLower.includes('rejet')) return 'rejete';
                    if (statusLower.includes('non') && statusLower.includes('conforme')) return 'non-conforme';
                    if (statusLower.includes('conforme')) return 'conforme';
                }
            }

            // Also check nested properties
            for (const [key, value] of Object.entries(analyse)) {
                if (typeof value === 'string') {
                    const valueLower = value.toLowerCase().replace(/_/g, ' ');
                    const keyLower = key.toLowerCase();
                    if (keyLower.includes('status') || keyLower.includes('statut')) {
                        if (valueLower.includes('rejet')) return 'rejete';
                        if (valueLower.includes('non') && valueLower.includes('conforme')) return 'non-conforme';
                        if (valueLower.includes('conforme')) return 'conforme';
                    }
                }
            }

            return null;
        }

        // Helper to display file analysis result (tag + human-readable accordion)
        function displayFileAnalyseResult(fileId, analyse) {
            const accordionDisplay = document.getElementById('accordion-analyse-display-' + fileId);
            const displayContent = document.getElementById('analyse-display-' + fileId);
            const fileTag = document.getElementById('file-tag-' + fileId);

            if (displayContent && analyse) {
                // Populate human-readable content
                displayContent.innerHTML = formatFileAnalyseDisplay(analyse);
                accordionDisplay.dataset.hasContent = 'true';
                accordionDisplay.style.display = 'block'; // Always show human-readable
            }

            // Set conformity tag
            if (fileTag && analyse) {
                const status = extractFileConformityStatus(analyse);
                if (status === 'rejete') {
                    fileTag.textContent = 'Rejeté';
                    fileTag.className = 'file-conformity-tag rejete show';
                } else if (status === 'non-conforme') {
                    fileTag.textContent = 'Non conforme';
                    fileTag.className = 'file-conformity-tag non-conforme show';
                } else if (status === 'conforme') {
                    fileTag.textContent = 'Conforme';
                    fileTag.className = 'file-conformity-tag conforme show';
                }
            }
        }

        function formatAnalysisResult(analyse) {
            if (!analyse || typeof analyse !== 'object') {
                return '<pre>' + JSON.stringify(analyse, null, 2) + '</pre>';
            }

            let html = '';

            // Helper to format field label
            function formatLabel(key) {
                return key
                    .replace(/_/g, ' ')
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
                    .toLowerCase()
                    .replace(/^./, str => str.toUpperCase());
            }

            // Helper to get status class
            function getStatusClass(value) {
                const valueLower = String(value).toLowerCase().replace(/_/g, ' ');
                if (valueLower.includes('rejet')) return 'status-rejete';
                if (valueLower.includes('non') && valueLower.includes('conforme')) return 'status-non-conforme';
                if (valueLower.includes('conforme')) return 'status-conforme';
                return '';
            }

            // Helper to render a value
            function renderValue(value, key) {
                if (value === null || value === undefined) return '<span class="analysis-result-value">-</span>';

                // Check if it's a status field
                const keyLower = key.toLowerCase();
                if (keyLower.includes('status') || keyLower.includes('statut')) {
                    const statusClass = getStatusClass(value);
                    const displayValue = String(value).replace(/_/g, ' ');
                    return '<span class="analysis-result-value ' + statusClass + '">' + displayValue + '</span>';
                }

                // Array of strings or simple values
                if (Array.isArray(value)) {
                    if (value.length === 0) return '<span class="analysis-result-value">Aucun</span>';

                    // Check if array of objects
                    if (typeof value[0] === 'object') {
                        let listHtml = '<ul class="analysis-result-list">';
                        value.forEach((item, index) => {
                            listHtml += '<li>';
                            if (typeof item === 'object') {
                                for (const [k, v] of Object.entries(item)) {
                                    listHtml += '<strong>' + formatLabel(k) + ':</strong> ' + String(v) + ' ';
                                }
                            } else {
                                listHtml += String(item);
                            }
                            listHtml += '</li>';
                        });
                        listHtml += '</ul>';
                        return listHtml;
                    }

                    // Simple array - show as badges
                    return value.map(v => '<span class="analysis-result-badge ok">' + v + '</span>').join('');
                }

                // Object
                if (typeof value === 'object') {
                    let objHtml = '<ul class="analysis-result-list">';
                    for (const [k, v] of Object.entries(value)) {
                        objHtml += '<li><strong>' + formatLabel(k) + ':</strong> ' + String(v) + '</li>';
                    }
                    objHtml += '</ul>';
                    return objHtml;
                }

                // Boolean
                if (typeof value === 'boolean') {
                    return value
                        ? '<span class="analysis-result-badge ok">Oui</span>'
                        : '<span class="analysis-result-badge missing">Non</span>';
                }

                return '<span class="analysis-result-value">' + String(value) + '</span>';
            }

            // Render each field
            for (const [key, value] of Object.entries(analyse)) {
                html += '<div class="analysis-result-section">';
                html += '<div class="analysis-result-label">' + formatLabel(key) + '</div>';
                html += renderValue(value, key);
                html += '</div>';
            }

            return html || '<p>Aucune donnée</p>';
        }
    </script>
</body>
</html>
    `;
  }
}
