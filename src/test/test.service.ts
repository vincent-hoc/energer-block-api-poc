import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  private getCommonStyles(): string {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #F0EFEC;
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

        .header-left {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .header-logo img {
            height: 48px;
        }

        .btn-back {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            background: transparent;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }

        .btn-back:hover {
            background: #f3f4f6;
            border-color: #d1d5db;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .debug-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
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
            background-color: #004d52;
        }

        .toggle-switch input:checked + .toggle-slider:before {
            transform: translateX(16px);
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            background: #dedcd4;
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
            max-width: 900px;
            margin: 0 auto;
            width: 100%;
        }

        .page-title {
            font-family: 'Rajdhani', sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
        }

        .page-subtitle {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 32px;
        }

        /* Dropzone */
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
            padding: 48px 32px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
            background: #fafafa;
        }

        .dropzone:hover {
            border-color: #00b48f;
            background: #f0fdf4;
        }

        .dropzone.dragover {
            border-color: #00b48f;
            background: #f0fdf4;
            border-style: solid;
        }

        .dropzone.has-file {
            border-color: #00b48f;
            background: #f0fdf4;
            border-style: solid;
        }

        .dropzone-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 16px;
            background: #e5e7eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .dropzone:hover .dropzone-icon,
        .dropzone.dragover .dropzone-icon {
            background: #d0f5ed;
        }

        .dropzone-icon svg {
            width: 28px;
            height: 28px;
            color: #6b7280;
        }

        .dropzone:hover .dropzone-icon svg,
        .dropzone.dragover .dropzone-icon svg {
            color: #00b48f;
        }

        .dropzone h3 {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }

        .dropzone p {
            font-size: 14px;
            color: #6b7280;
        }

        .dropzone input[type="file"] {
            display: none;
        }

        /* File list */
        .file-list {
            margin-top: 24px;
            display: none;
        }

        .file-list.show {
            display: block;
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
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .file-item-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .file-icon {
            width: 40px;
            height: 40px;
            background: #e5e7eb;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .file-icon svg {
            width: 20px;
            height: 20px;
            color: #6b7280;
        }

        .file-details {
            display: flex;
            flex-direction: column;
        }

        .file-name {
            font-size: 14px;
            font-weight: 500;
            color: #111827;
        }

        .file-size {
            font-size: 12px;
            color: #6b7280;
        }

        .file-uuid {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
            margin-right: 12px;
        }

        .file-uuid label {
            font-size: 11px;
            color: #6b7280;
            white-space: nowrap;
        }

        .file-uuid input {
            width: 120px;
            padding: 6px 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 12px;
            font-family: monospace;
        }

        .file-uuid input:focus {
            outline: none;
            border-color: #004d52;
            box-shadow: 0 0 0 2px rgba(77, 101, 255, 0.1);
        }

        .file-status {
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: 500;
        }

        .file-status.pending {
            background: #f3f4f6;
            color: #6b7280;
        }

        .file-status.processing {
            background: #dbeafe;
            color: #2563eb;
        }

        .file-status.complete {
            background: #d0f5ed;
            color: #009a7a;
        }

        .file-status.error {
            background: #fee2e2;
            color: #dc2626;
        }

        .btn-remove {
            background: none;
            border: none;
            cursor: pointer;
            color: #9ca3af;
            padding: 4px;
            transition: color 0.2s;
        }

        .btn-remove:hover {
            color: #ef4444;
        }

        /* Submit button */
        .submit-container {
            margin-top: 24px;
            text-align: center;
            display: none;
        }

        .submit-container.show {
            display: block;
        }

        .btn-submit {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 14px 32px;
            font-size: 16px;
            font-weight: 600;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-submit.summarize {
            background: linear-gradient(135deg, #00b48f 0%, #009a7a 100%);
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .btn-submit.summarize:hover:not(:disabled) {
            background: linear-gradient(135deg, #009a7a 0%, #007f72 100%);
            box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
            transform: translateY(-1px);
        }

        .btn-submit.analyse {
            background: linear-gradient(135deg, #007f72 0%, #006660 100%);
            box-shadow: 0 4px 12px rgba(0, 127, 114, 0.3);
        }

        .btn-submit.analyse:hover:not(:disabled) {
            background: linear-gradient(135deg, #006660 0%, #005550 100%);
            box-shadow: 0 6px 16px rgba(0, 127, 114, 0.4);
            transform: translateY(-1px);
        }

        .btn-submit:disabled {
            background: #d1d5db;
            color: #9ca3af;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }

        /* Results section */
        .results-section {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            margin-top: 24px;
            display: none;
        }

        .results-section.show {
            display: block;
        }

        .results-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }

        .results-title {
            font-family: 'Rajdhani', sans-serif;
            font-size: 20px;
            font-weight: 600;
            color: #111827;
            margin: 0;
        }

        .results-fosts {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .results-content {
            background: #1f2937;
            border-radius: 8px;
            padding: 16px;
            max-height: 500px;
            overflow-y: auto;
        }

        .results-content pre {
            color: #10b981;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 12px;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 0;
        }

        /* Debug sections */
        .debug-section {
            margin-top: 16px;
            display: none;
        }

        .debug-section.show {
            display: block;
        }

        .debug-accordion {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 8px;
            overflow: hidden;
        }

        .debug-accordion-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #f9fafb;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            transition: background 0.2s;
        }

        .debug-accordion-header:hover {
            background: #f3f4f6;
        }

        .debug-accordion-header .arrow {
            transition: transform 0.2s;
        }

        .debug-accordion-header.open .arrow {
            transform: rotate(180deg);
        }

        .debug-accordion-content {
            display: none;
            padding: 16px;
            background: #1f2937;
            max-height: 400px;
            overflow-y: auto;
        }

        .debug-accordion-content.open {
            display: block;
        }

        .debug-accordion-content pre {
            color: #10b981;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 11px;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 0;
        }

        .debug-step-label {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            padding: 12px 0 8px 0;
            margin-top: 8px;
            border-top: 1px solid #e5e7eb;
        }

        .debug-step-label:first-child {
            border-top: none;
            margin-top: 0;
        }

        .debug-file-accordion {
            margin-left: 16px;
        }

        /* Loading spinner */
        .loading-container {
            margin-top: 24px;
            display: none;
            text-align: center;
            padding: 32px;
        }

        .loading-container.show {
            display: block;
        }

        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #e5e7eb;
            border-top-color: #00b48f;
            border-radius: 50%;
            animation: spinner-rotate 1s linear infinite;
            margin: 0 auto 16px;
        }

        @keyframes spinner-rotate {
            to { transform: rotate(360deg); }
        }

        .loading-text {
            font-size: 16px;
            font-weight: 500;
            color: #374151;
        }

        .loading-dots {
            display: inline-block;
            width: 24px;
            text-align: left;
        }

        .loading-dots::after {
            content: '';
            animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
        }

        /* Step Progress */
        .steps-container {
            display: none;
            padding: 24px;
            background: #f9fafb;
            border-radius: 12px;
            margin-top: 16px;
        }

        .steps-container.show {
            display: block;
        }

        .steps-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .step-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px 16px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
        }

        .step-header {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
        }

        .step-files {
            display: none;
            flex-direction: column;
            gap: 4px;
            margin-left: 44px;
            font-size: 12px;
        }

        .step-item.active .step-files,
        .step-item.completed .step-files {
            display: flex;
        }

        .step-file {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 8px;
            background: #f9fafb;
            border-radius: 4px;
        }

        .step-file-name {
            flex: 1;
            color: #374151;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .step-file-status {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #6b7280;
        }

        .step-file.processing .step-file-status {
            color: #00b48f;
        }

        .step-file.completed .step-file-status {
            color: #00b48f;
        }

        .step-file.completed .step-file-name {
            color: #00b48f;
        }

        .file-spinner {
            width: 12px;
            height: 12px;
            border: 2px solid #e5e7eb;
            border-top-color: #00b48f;
            border-radius: 50%;
            animation: spinner-rotate 1s linear infinite;
        }

        .upload-progress {
            display: flex;
            align-items: center;
            gap: 6px;
            min-width: 80px;
        }

        .progress-bar {
            flex: 1;
            height: 4px;
            background: #e5e7eb;
            border-radius: 2px;
            overflow: hidden;
            min-width: 50px;
        }

        .progress-bar-fill {
            height: 100%;
            background: #00b48f;
            border-radius: 2px;
            transition: width 0.1s ease;
        }

        .progress-text {
            font-size: 11px;
            color: #6b7280;
            min-width: 35px;
            text-align: right;
        }

        .step-file.error {
            background: #fef2f2;
        }

        .step-file.error .step-file-name {
            color: #ef4444;
        }

        .step-file.error .step-file-status {
            color: #ef4444;
        }

        .file-type-tag {
            display: inline-block;
            padding: 2px 8px;
            background: #d0f5ed;
            color: #007f72;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            margin-left: 8px;
            vertical-align: middle;
        }

        .step-item.active {
            border-color: #00b48f;
            background: white;
        }

        .step-item.completed {
            border-color: #00b48f;
            background: white;
        }

        .step-item.error {
            border-color: #ef4444;
            background: #fef2f2;
        }

        .step-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e5e7eb;
            color: #6b7280;
            font-weight: 600;
            font-size: 14px;
            flex-shrink: 0;
        }

        .step-item.active .step-icon {
            background: #00b48f;
            color: white;
            animation: pulse 1.5s ease-in-out infinite;
        }

        .step-item.completed .step-icon {
            background: #00b48f;
            color: white;
        }

        .step-item.error .step-icon {
            background: #ef4444;
            color: white;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .step-content {
            flex: 1;
        }

        .step-title {
            font-weight: 600;
            color: #111827;
            font-size: 14px;
        }

        .step-item.active .step-title {
            color: #00b48f;
        }

        .step-description {
            font-size: 12px;
            color: #6b7280;
            margin-top: 2px;
        }

        .step-status {
            font-size: 12px;
            color: #6b7280;
        }

        .step-item.active .step-status {
            color: #00b48f;
        }

        .step-item.completed .step-status {
            color: #00b48f;
        }

        .step-item.error .step-status {
            color: #ef4444;
        }

        .step-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #e5e7eb;
            border-top-color: #00b48f;
            border-radius: 50%;
            animation: spinner-rotate 1s linear infinite;
        }

        /* Compact steps for Summarize page */
        .steps-compact {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .step-compact {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 13px;
            transition: all 0.2s;
        }

        .step-compact-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            background: #f3f4f6;
            border-radius: 50%;
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            flex-shrink: 0;
        }

        .step-compact-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .step-compact-label {
            color: #374151;
            font-weight: 500;
        }

        .step-compact-description {
            font-size: 11px;
            color: #9ca3af;
            font-weight: 400;
        }

        .step-compact-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #9ca3af;
        }

        .step-compact.active {
            border-color: #00b48f;
            background: #f0fdf9;
        }

        .step-compact.active .step-compact-number {
            background: #00b48f;
            color: white;
        }

        .step-compact.active .step-compact-status {
            color: #00b48f;
        }

        .step-compact.completed .step-compact-number {
            background: #00b48f;
            color: white;
        }

        .step-compact.completed .step-compact-status {
            color: #00b48f;
        }

        .step-compact.error {
            border-color: #ef4444;
            background: #fef2f2;
        }

        .step-compact.error .step-compact-number {
            background: #ef4444;
            color: white;
        }

        .step-compact.error .step-compact-status {
            color: #ef4444;
        }

        .step-compact-spinner {
            width: 14px;
            height: 14px;
            border: 2px solid #e5e7eb;
            border-top-color: #00b48f;
            border-radius: 50%;
            animation: spinner-rotate 1s linear infinite;
        }

        .step-type-tag {
            display: inline-block;
            padding: 2px 8px;
            background: #d0f5ed;
            color: #007f72;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .step-fost-tag {
            display: inline-block;
            padding: 2px 8px;
            background: #d0f5ed;
            color: #007f72;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
        }

        /* Spinner */
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Structured results */
        .structured-results {
            display: none;
        }

        .structured-results.show {
            display: block;
        }

        .result-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 16px;
        }

        .result-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .result-header-right {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .result-title {
            font-family: 'Rajdhani', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin: 0;
        }

        .tag {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 4px;
            text-transform: uppercase;
        }

        .tag-type {
            background: #ccebe8;
            color: #007f72;
        }

        .tag-fost {
            background: #d0f5ed;
            color: #009a7a;
        }

        .tag-keyword {
            background: #f3f4f6;
            color: #374151;
            text-transform: none;
            font-weight: 500;
        }

        .result-section {
            margin-bottom: 24px;
        }

        .result-section-title {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .result-resume {
            font-size: 15px;
            line-height: 1.6;
            color: #374151;
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #004d52;
        }

        .keywords-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .extracted-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        .extracted-table th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }

        .extracted-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
        }

        .extracted-table tr:hover {
            background: #f9fafb;
        }

        .nested-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-top: 8px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
        }

        .nested-table th {
            background: #e5e7eb;
            padding: 8px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
        }

        .nested-table td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
        }

        /* Extracted fields categories */
        .extracted-category {
            margin-bottom: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
        }

        .extracted-category:last-child {
            margin-bottom: 0;
        }

        .category-header {
            background: linear-gradient(135deg, #006660 0%, #007f72 100%);
            color: white;
            padding: 12px 16px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .category-content {
            padding: 0;
        }

        .category-content .extracted-table {
            margin: 0;
        }

        .category-content .extracted-table tbody tr:last-child td {
            border-bottom: none;
        }

        .field-name {
            width: 35%;
            background: #f9fafb;
            color: #374151;
        }

        .field-value {
            width: 65%;
        }

        .category-direct-value {
            padding: 12px 16px;
        }

        .tag-value {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            margin: 2px 4px 2px 0;
        }

        .object-inline {
            font-size: 13px;
        }

        .object-row {
            padding: 4px 0;
        }

        .object-row:first-child {
            padding-top: 0;
        }

        .object-key {
            color: #6b7280;
            font-weight: 500;
        }

        .object-val {
            color: #111827;
        }

        .analyse-section {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
        }

        .analyse-item {
            margin-bottom: 12px;
        }

        .analyse-item:last-child {
            margin-bottom: 0;
        }

        .analyse-label {
            font-size: 12px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 4px;
        }

        .analyse-value {
            font-size: 14px;
            color: #78350f;
        }

        /* Audit global status */
        .audit-global-status {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: 700;
        }

        .audit-global-status.status-conforme {
            background: linear-gradient(135deg, #d0f5ed 0%, #a7ede0 100%);
            border: 2px solid #00b48f;
            color: #166534;
        }

        .audit-global-status.status-non-conforme {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            border: 2px solid #ef4444;
            color: #991b1b;
        }

        .audit-global-status .status-icon {
            font-size: 24px;
        }

        /* Analysis detail */
        .analysis-detail {
            margin-bottom: 20px;
        }

        .detail-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
        }

        .detail-type {
            background: #006660;
            color: white;
            padding: 6px 14px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
        }

        .detail-type.type-check {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .detail-uuid {
            font-size: 12px;
            color: #6b7280;
            font-family: monospace;
        }

        /* Checklist summary */
        .checklist-summary {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
            padding: 12px 16px;
            background: #f3f4f6;
            border-radius: 8px;
        }

        .checklist-summary .summary-ok {
            color: #166534;
            font-weight: 600;
        }

        .checklist-summary .summary-ko {
            color: #991b1b;
            font-weight: 600;
        }

        .checklist-summary .summary-total {
            color: #6b7280;
        }

        /* Checklist container */
        .checklist-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        /* Checklist item */
        .checklist-item {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.2s ease;
        }

        .checklist-item:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .checklist-item.item-ok {
            border-left: 4px solid #00b48f;
        }

        .checklist-item.item-ko {
            border-left: 4px solid #ef4444;
        }

        .checklist-item.item-na {
            border-left: 4px solid #9ca3af;
        }

        .checklist-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: #fafafa;
        }

        .checklist-item.item-ok .checklist-header {
            background: #f0fdf4;
        }

        .checklist-item.item-ko .checklist-header {
            background: #fef2f2;
        }

        .checklist-item.item-na .checklist-header {
            background: #f9fafb;
        }

        .check-icon {
            font-size: 18px;
            font-weight: bold;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .item-ok .check-icon {
            color: #00b48f;
            background: #d0f5ed;
        }

        .item-ko .check-icon {
            color: #ef4444;
            background: #fee2e2;
        }

        .item-na .check-icon {
            color: #6b7280;
            background: #e5e7eb;
        }

        .check-point {
            flex: 1;
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
        }

        .check-status {
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 700;
        }

        .badge-ok {
            background: #d0f5ed;
            color: #166534;
        }

        .badge-ko {
            background: #fee2e2;
            color: #991b1b;
        }

        .badge-na {
            background: #e5e7eb;
            color: #4b5563;
        }

        /* Checklist details */
        .checklist-details {
            padding: 10px 16px 12px 52px;
            font-size: 13px;
            color: #4b5563;
            border-top: 1px solid #e5e7eb;
        }

        .check-rule, .check-observation {
            margin-bottom: 4px;
        }

        .check-rule:last-child, .check-observation:last-child {
            margin-bottom: 0;
        }

        .detail-label {
            font-weight: 600;
            color: #6b7280;
        }

        .raw-json-section {
            display: none;
        }

        .raw-json-section.show {
            display: block;
        }

        /* Form fields */
        .form-fields {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }

        .form-field {
            display: flex;
            flex-direction: column;
        }

        .form-field label {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .form-field input {
            padding: 10px 12px;
            font-size: 14px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-field input:focus {
            outline: none;
            border-color: #00b48f;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .form-field input::placeholder {
            color: #9ca3af;
            font-family: 'Public Sans', sans-serif;
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
            color: #004d52;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        /* Progress bar */
        .progress-container {
            display: none;
            margin: 20px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
        }

        .progress-container.show {
            display: block;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 12px;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #004d52 0%, #006660 100%);
            border-radius: 4px;
            transition: width 0.3s ease;
            width: 0%;
        }

        .progress-text {
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }

        /* Document cards */
        .documents-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
        }

        .document-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            transition: box-shadow 0.2s ease;
        }

        .document-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .document-card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-bottom: 1px solid #e5e7eb;
            cursor: pointer;
        }

        .document-card-header:hover {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        }

        .doc-index {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #006660 0%, #007f72 100%);
            color: white;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            flex-shrink: 0;
        }

        .doc-info {
            flex: 1;
            min-width: 0;
        }

        .doc-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .doc-uuid {
            font-size: 11px;
            color: #6b7280;
            font-family: monospace;
            margin-top: 2px;
        }

        .doc-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .doc-expand-icon {
            color: #9ca3af;
            transition: transform 0.2s ease;
        }

        .document-card.expanded .doc-expand-icon {
            transform: rotate(180deg);
        }

        .document-card-content {
            display: none;
            padding: 20px;
        }

        .document-card.expanded .document-card-content {
            display: block;
        }

        .structured-results {
            display: block;
        }

        .structured-results.show {
            display: block;
        }

        .keywords-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        /* Global analyse separator */
        .analyse-separator {
            display: flex;
            align-items: center;
            gap: 16px;
            margin: 32px 0 24px;
        }

        .analyse-separator::before,
        .analyse-separator::after {
            content: '';
            flex: 1;
            height: 2px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
        }

        .analyse-separator-text {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            white-space: nowrap;
        }
    `;
  }

  private getCommonScripts(): string {
    return `
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

        // Debug mode
        let debugMode = false;

        function toggleDebugMode() {
            debugMode = document.getElementById('debugToggle').checked;
            const debugSections = document.querySelectorAll('.debug-section');
            debugSections.forEach(section => {
                if (debugMode && section.dataset.hasContent === 'true') {
                    section.classList.add('show');
                } else {
                    section.classList.remove('show');
                }
            });
        }

        function toggleAccordion(id) {
            const header = document.querySelector('#accordion-' + id + ' .debug-accordion-header');
            const content = document.getElementById('accordion-content-' + id);
            header.classList.toggle('open');
            content.classList.toggle('open');
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Generate short UUID (8 characters)
        function generateShortUUID() {
            return crypto.randomUUID().split('-')[0];
        }

        // Format field name for display (convert snake_case to readable format)
        function formatFieldName(name) {
            if (!name) return '';
            return name
                .replace(/_/g, ' ')
                .replace(/\\b\\w/g, l => l.toUpperCase());
        }

        // Format date from YYYY-MM-DD to DD-MM-YYYY (handles dates in text too)
        function formatDate(value) {
            if (typeof value !== 'string') return value;
            return value.replace(/(\\d{4})-(\\d{2})-(\\d{2})/g, '$3-$2-$1');
        }

        // Format value (apply date formatting if applicable)
        function formatValue(value) {
            if (typeof value === 'string') {
                return formatDate(value);
            }
            return value;
        }

        // Render extracted fields as structured table
        function renderExtractedFields(fields) {
            if (!fields || (typeof fields === 'object' && Object.keys(fields).length === 0)) return '<em>Aucun champ extrait</em>';

            if (Array.isArray(fields)) {
                let html = '<table class="extracted-table"><thead><tr><th>Champ</th><th>Valeur</th></tr></thead><tbody>';
                fields.forEach(field => {
                    const fieldName = Object.keys(field)[0];
                    const fieldValue = field[fieldName];
                    html += '<tr>';
                    html += '<td><strong>' + formatFieldName(fieldName) + '</strong></td>';
                    html += '<td>' + renderFieldValue(fieldValue) + '</td>';
                    html += '</tr>';
                });
                html += '</tbody></table>';
                return html;
            }

            let html = '';
            Object.entries(fields).forEach(([categoryName, categoryValue]) => {
                html += '<div class="extracted-category">';
                html += '<div class="category-header">' + formatFieldName(categoryName) + '</div>';
                html += '<div class="category-content">';

                if (typeof categoryValue === 'object' && categoryValue !== null && !Array.isArray(categoryValue)) {
                    html += '<table class="extracted-table"><tbody>';
                    Object.entries(categoryValue).forEach(([key, value]) => {
                        html += '<tr>';
                        html += '<td class="field-name"><strong>' + formatFieldName(key) + '</strong></td>';
                        html += '<td class="field-value">' + renderFieldValue(value) + '</td>';
                        html += '</tr>';
                    });
                    html += '</tbody></table>';
                } else {
                    html += '<div class="category-direct-value">' + renderFieldValue(categoryValue) + '</div>';
                }

                html += '</div></div>';
            });
            return html;
        }

        // Render field value (handles nested arrays/objects)
        function renderFieldValue(value) {
            if (value === null || value === undefined) {
                return '<em>-</em>';
            }

            if (Array.isArray(value)) {
                if (value.length === 0) return '<em>-</em>';
                if (typeof value[0] === 'object' && value[0] !== null) {
                    return renderNestedTable(value);
                }
                return value.map(v => '<span class="tag tag-keyword">' + formatValue(v) + '</span>').join(' ');
            }

            if (typeof value === 'object') {
                return renderNestedTable([value]);
            }

            return String(formatValue(value));
        }

        // Render nested table for complex data
        function renderNestedTable(items) {
            if (!items || items.length === 0) return '<em>-</em>';

            const headersSet = new Set();
            items.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    Object.keys(item).forEach(key => headersSet.add(key));
                }
            });
            const headers = Array.from(headersSet);

            if (headers.length === 0) return '<em>-</em>';

            let html = '<table class="nested-table"><thead><tr>';
            headers.forEach(h => {
                html += '<th>' + formatFieldName(h) + '</th>';
            });
            html += '</tr></thead><tbody>';

            items.forEach(item => {
                html += '<tr>';
                headers.forEach(h => {
                    const cellValue = item[h];
                    html += '<td>' + renderCellValue(cellValue) + '</td>';
                });
                html += '</tr>';
            });

            html += '</tbody></table>';
            return html;
        }

        // Render cell value with proper formatting
        function renderCellValue(value) {
            if (value === null || value === undefined || value === '') {
                return '<em>-</em>';
            }

            if (Array.isArray(value)) {
                if (value.length === 0) return '<em>-</em>';
                if (typeof value[0] === 'object' && value[0] !== null) {
                    return renderNestedTable(value);
                }
                return value.map(v => '<span class="tag tag-value">' + formatValue(v) + '</span>').join(' ');
            }

            if (typeof value === 'object') {
                let html = '<div class="object-inline">';
                Object.entries(value).forEach(([k, v]) => {
                    html += '<div class="object-row"><span class="object-key">' + formatFieldName(k) + ':</span> ';
                    html += '<span class="object-val">' + renderCellValue(v) + '</span></div>';
                });
                html += '</div>';
                return html;
            }

            return String(formatValue(value));
        }

        // Render analyse section as checklist
        function renderAnalyse(analyse) {
            if (!analyse) return '<em>Aucune analyse disponible</em>';

            if (typeof analyse === 'object' && !Array.isArray(analyse)) {
                return renderAnalyseObject(analyse);
            }

            if (Array.isArray(analyse) && analyse.length === 0) {
                return '<em>Aucune analyse disponible</em>';
            }

            if (Array.isArray(analyse) && analyse.length > 0) {
                const first = analyse[0];
                if (first && (first.meta_audit || first.analysis_details)) {
                    return renderAnalyseObject(first);
                }
            }

            let html = '';
            analyse.forEach(item => {
                if (typeof item === 'object') {
                    Object.entries(item).forEach(([key, value]) => {
                        html += '<div class="analyse-item">';
                        html += '<div class="analyse-label">' + key + '</div>';
                        html += '<div class="analyse-value">' + renderAnalyseValue(value) + '</div>';
                        html += '</div>';
                    });
                } else {
                    html += '<div class="analyse-item">';
                    html += '<div class="analyse-value">' + String(item) + '</div>';
                    html += '</div>';
                }
            });
            return html;
        }

        // Render analyse object with checklist format
        function renderAnalyseObject(analyse) {
            let html = '';

            if (analyse.meta_audit && analyse.meta_audit.global_status) {
                const status = analyse.meta_audit.global_status;
                const isConforme = status === 'CONFORME';
                html += '<div class="audit-global-status ' + (isConforme ? 'status-conforme' : 'status-non-conforme') + '">';
                html += '<span class="status-icon">' + (isConforme ? '✓' : '✗') + '</span>';
                html += '<span class="status-text">' + status.replace(/_/g, ' ') + '</span>';
                html += '</div>';
            }

            if (analyse.analysis_details && Array.isArray(analyse.analysis_details)) {
                analyse.analysis_details.forEach(detail => {
                    html += '<div class="analysis-detail">';

                    if (detail.type_doc) {
                        // Document-specific analysis
                        html += '<div class="detail-header">';
                        html += '<span class="detail-type">' + detail.type_doc + '</span>';
                        if (detail.document_UUID) {
                            html += '<span class="detail-uuid">' + detail.document_UUID + '</span>';
                        }
                        html += '</div>';
                    } else if (detail.type_check) {
                        // Global check section (not document-specific)
                        html += '<div class="detail-header">';
                        html += '<span class="detail-type type-check">' + detail.type_check + '</span>';
                        html += '</div>';
                    }

                    if (detail.check_list && Array.isArray(detail.check_list)) {
                        html += renderChecklist(detail.check_list);
                    }

                    html += '</div>';
                });
            }

            return html;
        }

        // Render checklist items
        function renderChecklist(checkList) {
            const okCount = checkList.filter(item => item.status === 'OK').length;
            const koCount = checkList.filter(item => item.status === 'KO').length;
            const naCount = checkList.filter(item => item.status === 'NON_APPLICABLE').length;
            const total = checkList.length;

            let html = '<div class="checklist-summary">';
            html += '<span class="summary-ok">' + okCount + ' conformités</span>';
            html += '<span class="summary-ko">' + koCount + ' non-conformités</span>';
            if (naCount > 0) {
                html += '<span class="summary-na" style="color:#6b7280;">' + naCount + ' N/A</span>';
            }
            html += '<span class="summary-total">sur ' + total + ' points</span>';
            html += '</div>';

            html += '<div class="checklist-container">';
            checkList.forEach(item => {
                const isOk = item.status === 'OK';
                const isNa = item.status === 'NON_APPLICABLE';
                const itemClass = isOk ? 'item-ok' : (isNa ? 'item-na' : 'item-ko');
                const badgeClass = isOk ? 'badge-ok' : (isNa ? 'badge-na' : 'badge-ko');
                const icon = isOk ? '✓' : (isNa ? '—' : '✗');

                html += '<div class="checklist-item ' + itemClass + '">';

                html += '<div class="checklist-header">';
                html += '<span class="check-icon">' + icon + '</span>';
                html += '<span class="check-point">' + (item.check_point || '') + '</span>';
                html += '<span class="check-status ' + badgeClass + '">' + item.status.replace('_', ' ') + '</span>';
                html += '</div>';

                html += '<div class="checklist-details">';
                if (item.rule_ref_rag) {
                    html += '<div class="check-rule"><span class="detail-label">Référence:</span> ' + item.rule_ref_rag + '</div>';
                }
                if (item.observation) {
                    html += '<div class="check-observation"><span class="detail-label">Observation:</span> ' + formatDate(item.observation) + '</div>';
                }
                html += '</div>';

                html += '</div>';
            });
            html += '</div>';

            return html;
        }

        // Render analyse value (legacy)
        function renderAnalyseValue(value) {
            if (Array.isArray(value)) {
                return value.join(', ');
            }
            if (typeof value === 'object' && value !== null) {
                return '<pre style="margin:0;font-size:12px;">' + JSON.stringify(value, null, 2) + '</pre>';
            }
            return String(value);
        }
    `;
  }

  getSummarizePage(): string {
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
    <title>Energer - Synthèse document</title>
    <style>${this.getCommonStyles()}</style>
</head>
<body>
    <header class="header">
        <div class="header-left">
            <div class="header-logo">
                <img src="https://cdn.prod.website-files.com/684fc8bdc6e7edd505c58655/69147295c08d5fe3c86bbbf7_energer-logo_energer-default%20black.svg" alt="Energer">
            </div>
            <a href="/dashboard" class="btn-back">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Retour
            </a>
        </div>
        <div class="header-right">
            <div class="debug-toggle">
                <span class="debug-label">Debug</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="debugToggle" onchange="toggleDebugMode()">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="user-avatar" id="userAvatar">D</div>
            <button class="btn-logout" onclick="logout()">Deconnexion</button>
        </div>
    </header>

    <main class="main">
        <h1 class="page-title">Synthèse document</h1>
        <p class="page-subtitle">Deposez un fichier PDF pour tester l'extraction et l'analyse</p>

        <div class="dropzone-card">
            <div class="form-fields">
                <div class="form-field">
                    <label for="vaultUuid">Opération UUID</label>
                    <input type="text" id="vaultUuid" placeholder="UUID de l'opération">
                </div>
                <div class="form-field">
                    <label for="documentUuid">Document UUID</label>
                    <input type="text" id="documentUuid" placeholder="UUID du document">
                </div>
                <div class="form-field">
                    <label for="fostKey">FOST Key</label>
                    <input type="text" id="fostKey" placeholder="Optionnel">
                </div>
            </div>

            <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
                <div class="dropzone-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <h3>Glissez-deposez votre fichier ici</h3>
                <p>ou cliquez pour selectionner un fichier PDF</p>
                <input type="file" id="fileInput" accept=".pdf">
            </div>

            <div class="file-list" id="fileList">
                <div class="file-list-title">Fichier selectionne</div>
                <div id="fileItems"></div>
            </div>

            <div class="steps-container" id="stepsContainer">
                <div class="steps-compact">
                    <div class="step-compact" id="step-upload">
                        <div class="step-compact-number">1</div>
                        <div class="step-compact-content">
                            <div class="step-compact-label">Upload du fichier</div>
                            <div class="step-compact-description">Envoi du document vers le serveur</div>
                        </div>
                        <div class="step-compact-status" id="step-upload-status">En attente</div>
                    </div>
                    <div class="step-compact" id="step-ocr">
                        <div class="step-compact-number">2</div>
                        <div class="step-compact-content">
                            <div class="step-compact-label">Extraction OCR</div>
                            <div class="step-compact-description">Extraction du texte brut</div>
                        </div>
                        <div class="step-compact-status" id="step-ocr-status">En attente</div>
                    </div>
                    <div class="step-compact" id="step-analyze">
                        <div class="step-compact-number">3</div>
                        <div class="step-compact-content">
                            <div class="step-compact-label">Analyse du document</div>
                            <div class="step-compact-description">Synthèse et extraction des informations</div>
                        </div>
                        <div class="step-compact-status" id="step-analyze-status">En attente</div>
                    </div>
                    <div class="step-compact" id="step-fost">
                        <div class="step-compact-number">4</div>
                        <div class="step-compact-content">
                            <div class="step-compact-label">Identification FOST</div>
                            <div class="step-compact-description">Classification de la FOST et de sa version</div>
                        </div>
                        <div class="step-compact-status" id="step-fost-status">En attente</div>
                    </div>
                    <div class="step-compact" id="step-ocode">
                        <div class="step-compact-number">5</div>
                        <div class="step-compact-content">
                            <div class="step-compact-label">Analyse de conformité</div>
                            <div class="step-compact-description">Vérification des critères de conformité</div>
                        </div>
                        <div class="step-compact-status" id="step-ocode-status">En attente</div>
                    </div>
                </div>
            </div>

            <div class="submit-container" id="submitContainer">
                <button class="btn-submit summarize" id="btnSubmit" onclick="submitSummarize()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    Lancer l'analyse
                </button>
            </div>
        </div>

        <div class="results-section" id="resultsSection">
            <!-- Structured display (non-debug mode) -->
            <div class="structured-results" id="structuredResults">
                <div class="result-header" id="resultHeader">
                    <!-- Title, type_doc tag, fost tag will be inserted here -->
                </div>

                <div class="result-section" id="resumeSection">
                    <div class="result-section-title">Resume</div>
                    <div class="result-resume" id="resultResume"></div>
                </div>

                <div class="result-section" id="keywordsSection">
                    <div class="result-section-title">Mots-cles</div>
                    <div class="keywords-container" id="keywordsContainer"></div>
                </div>

                <div class="result-section" id="extractedFieldsSection">
                    <div class="result-section-title">Champs extraits</div>
                    <div id="extractedFieldsContainer"></div>
                </div>

                <div class="result-section" id="analyseSection">
                    <div class="result-section-title">Analyse</div>
                    <div class="analyse-section" id="analyseContainer"></div>
                </div>
            </div>

            <!-- Raw JSON display (debug mode) -->
            <div class="raw-json-section" id="rawJsonSection">
                <h2 class="results-title">Retour API (Debug)</h2>
                <div class="results-content">
                    <pre id="resultsContent"></pre>
                </div>
            </div>

            <!-- Debug sections (shown at bottom when debug mode enabled) -->
            <div class="debug-section" id="debugSection" data-has-content="false">
                <div class="debug-accordion" id="accordion-upload">
                    <div class="debug-accordion-header" onclick="toggleAccordion('upload')">
                        <span>1. OCR texte brut</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-upload">
                        <pre id="debugUploadContent"></pre>
                    </div>
                </div>

                <div class="debug-accordion" id="accordion-ocr">
                    <div class="debug-accordion-header" onclick="toggleAccordion('ocr')">
                        <span>2. Extraction OCR</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-ocr">
                        <pre id="debugOcrContent"></pre>
                    </div>
                </div>

                <div class="debug-accordion" id="accordion-extraction">
                    <div class="debug-accordion-header" onclick="toggleAccordion('extraction')">
                        <span>3. Analyse du document</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-extraction">
                        <pre id="debugExtractionContent"></pre>
                    </div>
                </div>

                <div class="debug-accordion" id="accordion-fost">
                    <div class="debug-accordion-header" onclick="toggleAccordion('fost')">
                        <span>4. Identification FOST</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-fost">
                        <pre id="debugFostContent"></pre>
                    </div>
                </div>

                <div class="debug-accordion" id="accordion-analyse">
                    <div class="debug-accordion-header" onclick="toggleAccordion('analyse')">
                        <span>5. Analyse de conformité</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-analyse">
                        <pre id="debugAnalyseContent"></pre>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
        <p>&copy; 2026 <a href="https://www.energer.ai" target="_blank">Energer.ai</a> - Quantum Of Trust</p>
    </footer>

    <script>
        ${this.getCommonScripts()}

        // Initialize UUID fields
        document.getElementById('vaultUuid').value = generateShortUUID();
        document.getElementById('documentUuid').value = generateShortUUID();

        let selectedFile = null;

        // Drag and drop
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('fileInput');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
        });

        dropzone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
            fileInput.value = '';
        });

        function handleFile(file) {
            if (!file.name.toLowerCase().endsWith('.pdf')) {
                alert('Veuillez selectionner un fichier PDF');
                return;
            }

            selectedFile = file;
            dropzone.style.display = 'none';

            const fileList = document.getElementById('fileList');
            const fileItems = document.getElementById('fileItems');
            const submitContainer = document.getElementById('submitContainer');

            fileItems.innerHTML = \`
                <div class="file-item">
                    <div class="file-item-info">
                        <div class="file-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div class="file-details">
                            <span class="file-name">\${file.name}</span>
                            <span class="file-size">\${formatFileSize(file.size)}</span>
                        </div>
                    </div>
                    <button class="btn-remove" onclick="removeFile()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            \`;

            fileList.classList.add('show');
            submitContainer.classList.add('show');
        }

        function removeFile() {
            selectedFile = null;
            dropzone.style.display = 'block';
            document.getElementById('fileList').classList.remove('show');
            document.getElementById('submitContainer').classList.remove('show');
        }

        function updateStep(stepId, status, statusText, extraData) {
            const stepElement = document.getElementById('step-' + stepId);
            const statusElement = document.getElementById('step-' + stepId + '-status');

            stepElement.classList.remove('active', 'completed', 'error');

            if (status === 'active') {
                stepElement.classList.add('active');
                statusElement.innerHTML = '<div class="step-compact-spinner"></div> En cours';
            } else if (status === 'completed') {
                stepElement.classList.add('completed');
                let statusHtml = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>';
                if (stepId === 'analyze' && extraData) {
                    statusHtml = '<span class="step-type-tag">' + extraData + '</span> ' + statusHtml;
                } else if (stepId === 'fost' && extraData && Array.isArray(extraData) && extraData.length > 0) {
                    const fostTags = extraData.map(f => '<span class="step-fost-tag">' + formatDate(f) + '</span>').join(' ');
                    statusHtml = fostTags + ' ' + statusHtml;
                }
                statusElement.innerHTML = statusHtml;
            } else if (status === 'error') {
                stepElement.classList.add('error');
                statusElement.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg> ' + (statusText || 'Erreur');
            } else {
                statusElement.textContent = statusText || 'En attente';
            }
        }

        function resetSteps() {
            ['upload', 'ocr', 'analyze', 'fost', 'ocode'].forEach(step => {
                updateStep(step, 'pending', 'En attente');
            });
        }

        async function submitSummarize() {
            if (!selectedFile) return;

            const btnSubmit = document.getElementById('btnSubmit');
            const stepsContainer = document.getElementById('stepsContainer');
            const resultsSection = document.getElementById('resultsSection');

            // Disable button and show steps
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner"></span> Traitement...';
            resetSteps();
            stepsContainer.classList.add('show');
            resultsSection.classList.remove('show');

            const documentUuid = document.getElementById('documentUuid').value;
            const fostKey = document.getElementById('fostKey').value;

            let uploadResult, ocrResult, analysisResult, fostsResult, ocodeResult;
            let debugOcr = null;
            let debugBlocks = null;

            try {
                // Step 1: Upload file
                updateStep('upload', 'active');
                const formData = new FormData();
                formData.append('file', selectedFile);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + token
                    },
                    body: formData
                });

                if (!uploadResponse.ok) throw new Error('Erreur upload');
                uploadResult = await uploadResponse.json();
                updateStep('upload', 'completed');

                // Step 2: OCR with Textract
                updateStep('ocr', 'active');
                const ocrResponse = await fetch('/api/summarize/ocr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + token
                    },
                    body: JSON.stringify({
                        s3_key: uploadResult.s3_key,
                        debug: true
                    })
                });

                if (!ocrResponse.ok) throw new Error('Erreur OCR');
                ocrResult = await ocrResponse.json();
                debugOcr = ocrResult.extracted_text;
                debugBlocks = ocrResult.blocks;
                updateStep('ocr', 'completed');

                // Step 3: Analyze text
                updateStep('analyze', 'active');
                const analyzeResponse = await fetch('/api/summarize/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + token
                    },
                    body: JSON.stringify({
                        extracted_text: ocrResult.extracted_text,
                        document_uuid: documentUuid
                    })
                });

                if (!analyzeResponse.ok) throw new Error('Erreur Analyse');
                analysisResult = await analyzeResponse.json();
                updateStep('analyze', 'completed', null, analysisResult.type_doc);

                // Step 4: FOST identification
                updateStep('fost', 'active');

                let fostsValue;
                if (fostKey && fostKey.trim() !== '') {
                    // Use provided fost_key directly
                    fostsValue = [fostKey.trim()];
                    updateStep('fost', 'completed', null, fostsValue);
                } else {
                    const fostResponse = await fetch('/api/summarize/fost', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + token
                        },
                        body: JSON.stringify({
                            analysis_result: analysisResult
                        })
                    });

                    if (!fostResponse.ok) throw new Error('Erreur FOST');
                    fostsResult = await fostResponse.json();
                    fostsValue = fostsResult;
                    updateStep('fost', 'completed', null, fostsValue);
                }

                // Step 5: Analyse de conformité
                updateStep('ocode', 'active');
                const ocodeResponse = await fetch('/api/summarize/ocode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + token
                    },
                    body: JSON.stringify({
                        fosts: fostsValue,
                        documents: [analysisResult]
                    })
                });

                if (!ocodeResponse.ok) throw new Error('Erreur Analyse de conformité');
                ocodeResult = await ocodeResponse.json();
                updateStep('ocode', 'completed');

                // Build final result
                const result = {
                    documents: [analysisResult],
                    fosts: fostsValue,
                    analyse: ocodeResult,
                    debug_OCR: debugOcr,
                    debug_OCR_JSON: debugBlocks
                };

                // Hide steps after small delay
                setTimeout(() => {
                    stepsContainer.classList.remove('show');
                }, 500);

                // Get document data from first document
                const doc = result.documents && result.documents[0] ? result.documents[0] : {};
                const fosts = result.fosts || [];
                const analyse = result.analyse || [];

                // Always show structured display
                document.getElementById('rawJsonSection').classList.remove('show');
                document.getElementById('structuredResults').classList.add('show');

                {
                    // Header: left (type_doc + title) | right (fost tags)
                    let leftHtml = '';
                    if (doc.type_doc) {
                        leftHtml += '<span class="tag tag-type">' + doc.type_doc + '</span>';
                    }
                    if (doc.document_title) {
                        leftHtml += '<h2 class="result-title">' + doc.document_title + '</h2>';
                    }

                    let rightHtml = '';
                    if (fosts && fosts.length > 0) {
                        fosts.forEach(fost => {
                            rightHtml += '<span class="tag tag-fost">' + formatDate(fost) + '</span>';
                        });
                    }

                    let headerHtml = '<div class="result-header-left">' + leftHtml + '</div>';
                    headerHtml += '<div class="result-header-right">' + rightHtml + '</div>';
                    document.getElementById('resultHeader').innerHTML = headerHtml;

                    // Resume
                    if (doc.document_resume) {
                        document.getElementById('resultResume').textContent = doc.document_resume;
                        document.getElementById('resumeSection').style.display = 'block';
                    } else {
                        document.getElementById('resumeSection').style.display = 'none';
                    }

                    // Keywords
                    if (doc.document_key_words && doc.document_key_words.length > 0) {
                        const keywordsHtml = doc.document_key_words.map(kw =>
                            '<span class="tag tag-keyword">' + kw + '</span>'
                        ).join('');
                        document.getElementById('keywordsContainer').innerHTML = keywordsHtml;
                        document.getElementById('keywordsSection').style.display = 'block';
                    } else {
                        document.getElementById('keywordsSection').style.display = 'none';
                    }

                    // Extracted fields
                    const hasExtractedFields = doc.Extracted_fields && (
                        (Array.isArray(doc.Extracted_fields) && doc.Extracted_fields.length > 0) ||
                        (typeof doc.Extracted_fields === 'object' && Object.keys(doc.Extracted_fields).length > 0)
                    );
                    if (hasExtractedFields) {
                        document.getElementById('extractedFieldsContainer').innerHTML = renderExtractedFields(doc.Extracted_fields);
                        document.getElementById('extractedFieldsSection').style.display = 'block';
                    } else {
                        document.getElementById('extractedFieldsSection').style.display = 'none';
                    }

                    // Analyse
                    const hasAnalyse = analyse && (
                        (Array.isArray(analyse) && analyse.length > 0) ||
                        (typeof analyse === 'object' && Object.keys(analyse).length > 0)
                    );
                    if (hasAnalyse) {
                        document.getElementById('analyseContainer').innerHTML = renderAnalyse(analyse);
                        document.getElementById('analyseSection').style.display = 'block';
                    } else {
                        document.getElementById('analyseSection').style.display = 'none';
                    }
                }

                // Debug sections - populate each step's result
                document.getElementById('debugUploadContent').textContent = ocrResult.extracted_text || '';
                document.getElementById('debugOcrContent').textContent = JSON.stringify(ocrResult, null, 2);
                document.getElementById('debugExtractionContent').textContent = JSON.stringify(analysisResult, null, 2);
                document.getElementById('debugFostContent').textContent = JSON.stringify(fostsValue, null, 2);
                document.getElementById('debugAnalyseContent').textContent = JSON.stringify(ocodeResult, null, 2);

                document.getElementById('debugSection').dataset.hasContent = 'true';
                if (debugMode) {
                    document.getElementById('debugSection').classList.add('show');
                } else {
                    document.getElementById('debugSection').classList.remove('show');
                }

                resultsSection.classList.add('show');

            } catch (error) {
                console.error('Error:', error);
                // Mark current active step as error
                ['upload', 'ocr', 'analyze', 'fost', 'ocode'].forEach(step => {
                    const el = document.getElementById('step-' + step);
                    if (el.classList.contains('active')) {
                        updateStep(step, 'error', error.message);
                    }
                });
                alert('Erreur: ' + error.message);
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = \`
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    Lancer l'analyse
                \`;
            }
        }
    </script>
</body>
</html>
    `;
  }

  getAnalysePage(): string {
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
    <title>Energer - Analyse dossier</title>
    <style>${this.getCommonStyles()}
        /* Analyse page color overrides */
        .dropzone:hover { border-color: #007f72; }
        .dropzone.drag-over { border-color: #007f72; }
        .dropzone.file-selected { border-color: #007f72; }
        .file-status.uploaded { background: #ccebe8; color: #007f72; }
        .btn-submit { background: linear-gradient(135deg, #007f72 0%, #006660 100%); }
        .btn-submit:hover:not(:disabled) { background: linear-gradient(135deg, #006660 0%, #005550 100%); }
        .loading-spinner { border-top-color: #007f72; }
        .file-success-icon { background: #ccebe8; color: #006660; }
        .document-card { border: 2px solid #007f72; }
        .document-card-header { background: linear-gradient(135deg, #ccebe8 0%, #b3e0db 100%); }
        .document-card-header:hover { background: linear-gradient(135deg, #b3e0db 0%, #a0d4cf 100%); }
        .document-card-content { background: white; }
        .checklist-item.item-ok { border-left: 4px solid #007f72; }
        .item-ok .check-icon { color: #007f72; background: #ccebe8; }
        .badge-ok { background: #ccebe8; }
        .toggle-switch input:checked + .toggle-slider { background-color: #007f72; }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-left">
            <div class="header-logo">
                <img src="https://cdn.prod.website-files.com/684fc8bdc6e7edd505c58655/69147295c08d5fe3c86bbbf7_energer-logo_energer-default%20black.svg" alt="Energer">
            </div>
            <a href="/dashboard" class="btn-back">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Retour
            </a>
        </div>
        <div class="header-right">
            <div class="debug-toggle">
                <span class="debug-label">Debug</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="debugToggle" onchange="toggleDebugMode()">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="user-avatar" id="userAvatar">D</div>
            <button class="btn-logout" onclick="logout()">Deconnexion</button>
        </div>
    </header>

    <main class="main">
        <h1 class="page-title">Analyse dossier</h1>
        <p class="page-subtitle">Deposez plusieurs fichiers PDF pour tester l'analyse complete d'un dossier</p>

        <div class="dropzone-card">
            <div class="form-fields" style="grid-template-columns: 1fr;">
                <div class="form-field">
                    <label for="vaultUuid">Opération UUID</label>
                    <input type="text" id="vaultUuid" placeholder="UUID de l'opération">
                </div>
            </div>

            <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
                <div class="dropzone-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <h3>Glissez-deposez vos fichiers ici</h3>
                <p>ou cliquez pour selectionner des fichiers PDF (plusieurs fichiers possibles)</p>
                <input type="file" id="fileInput" accept=".pdf" multiple>
            </div>

            <div class="file-list" id="fileList">
                <div class="file-list-title">Fichiers selectionnes (<span id="fileCount">0</span>)</div>
                <div id="fileItems"></div>
            </div>

            <div class="steps-container" id="stepsContainer">
                <div class="steps-list">
                    <div class="step-item" id="step-upload">
                        <div class="step-header">
                            <div class="step-icon">1</div>
                            <div class="step-content">
                                <div class="step-title">Upload des fichiers</div>
                                <div class="step-description">Envoi des documents vers le serveur</div>
                            </div>
                            <div class="step-status" id="step-upload-status">En attente</div>
                        </div>
                        <div class="step-files" id="step-upload-files"></div>
                    </div>
                    <div class="step-item" id="step-ocr">
                        <div class="step-header">
                            <div class="step-icon">2</div>
                            <div class="step-content">
                                <div class="step-title">Extraction OCR</div>
                                <div class="step-description">Extraction du texte brut</div>
                            </div>
                            <div class="step-status" id="step-ocr-status">En attente</div>
                        </div>
                        <div class="step-files" id="step-ocr-files"></div>
                    </div>
                    <div class="step-item" id="step-analyze">
                        <div class="step-header">
                            <div class="step-icon">3</div>
                            <div class="step-content">
                                <div class="step-title">Analyse des documents</div>
                                <div class="step-description">Synthèse et extraction des informations</div>
                            </div>
                            <div class="step-status" id="step-analyze-status">En attente</div>
                        </div>
                        <div class="step-files" id="step-analyze-files"></div>
                    </div>
                    <div class="step-item" id="step-fost">
                        <div class="step-header">
                            <div class="step-icon">4</div>
                            <div class="step-content">
                                <div class="step-title">Identification FOST</div>
                                <div class="step-description">Classification de la FOST et de sa version</div>
                            </div>
                            <div class="step-status" id="step-fost-status">En attente</div>
                        </div>
                    </div>
                    <div class="step-item" id="step-ocode">
                        <div class="step-header">
                            <div class="step-icon">5</div>
                            <div class="step-content">
                                <div class="step-title">Analyse de conformité</div>
                                <div class="step-description">Vérification des critères de conformité</div>
                            </div>
                            <div class="step-status" id="step-ocode-status">En attente</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="submit-container" id="submitContainer">
                <button class="btn-submit analyse" id="btnSubmit" onclick="submitAnalyse()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                    Lancer l'Analyse
                </button>
            </div>
        </div>

        <div class="results-section" id="resultsSection">
            <div class="results-header">
                <h2 class="results-title">Resultat</h2>
                <div class="results-fosts" id="resultsFosts"></div>
            </div>

            <!-- Structured display -->
            <div id="structuredResults" class="structured-results">
                <!-- Document cards list -->
                <div class="documents-list" id="documentsList"></div>

                <!-- Global Analysis section (separated) -->
                <div id="analyseWrapper" style="display: none;">
                    <div class="analyse-separator">
                        <span class="analyse-separator-text">Analyse globale de conformité</span>
                    </div>
                    <div class="analyse-section" id="analyseContainer"></div>
                </div>
            </div>

            <!-- Debug section -->
            <div class="debug-section" id="debugSection" data-has-content="false">
                <!-- OCR text accordions (one per file) -->
                <div class="debug-step-label">1. OCR texte brut</div>
                <div id="debugOcrTextAccordions"></div>

                <!-- OCR extraction accordions (one per file) -->
                <div class="debug-step-label">2. Extraction OCR (blocs JSON)</div>
                <div id="debugOcrBlocksAccordions"></div>

                <!-- Analyse accordions (one per file) -->
                <div class="debug-step-label">3. Analyse des documents</div>
                <div id="debugAnalyseAccordions"></div>

                <div class="debug-accordion" id="accordion-fost">
                    <div class="debug-accordion-header" onclick="toggleAccordion('fost')">
                        <span>4. Identification FOST</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-fost">
                        <pre id="debugFostContent"></pre>
                    </div>
                </div>

                <div class="debug-accordion" id="accordion-conformite">
                    <div class="debug-accordion-header" onclick="toggleAccordion('conformite')">
                        <span>5. Analyse de conformité</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-conformite">
                        <pre id="debugConformiteContent"></pre>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <footer class="footer">
        <p>&copy; 2026 <a href="https://www.energer.ai" target="_blank">Energer.ai</a> - Quantum Of Trust</p>
    </footer>

    <script>
        ${this.getCommonScripts()}

        // Initialize operation UUID
        document.getElementById('vaultUuid').value = generateShortUUID();

        let selectedFiles = [];

        // Drag and drop
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('fileInput');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
        });

        dropzone.addEventListener('drop', (e) => {
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleFiles(files);
            fileInput.value = '';
        });

        function handleFiles(files) {
            const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
            if (pdfFiles.length === 0) {
                alert('Veuillez selectionner des fichiers PDF');
                return;
            }

            pdfFiles.forEach(file => {
                if (!selectedFiles.find(f => f.name === file.name)) {
                    selectedFiles.push(file);
                }
            });

            updateFileList();
        }

        function updateFileList() {
            const fileList = document.getElementById('fileList');
            const fileItems = document.getElementById('fileItems');
            const fileCount = document.getElementById('fileCount');
            const submitContainer = document.getElementById('submitContainer');

            if (selectedFiles.length > 0) {
                dropzone.classList.add('has-file');
                fileList.classList.add('show');
                submitContainer.classList.add('show');
                fileCount.textContent = selectedFiles.length;

                fileItems.innerHTML = selectedFiles.map((file, index) => {
                    // Generate document_uuid if not already set
                    if (!file.document_uuid) {
                        file.document_uuid = generateShortUUID();
                    }
                    return \`
                    <div class="file-item">
                        <div class="file-item-info">
                            <div class="file-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div class="file-details">
                                <span class="file-name">\${file.name}</span>
                                <span class="file-size">\${formatFileSize(file.size)}</span>
                            </div>
                        </div>
                        <div class="file-uuid">
                            <label>Document UUID</label>
                            <input type="text" value="\${file.document_uuid}" onchange="updateFileUuid(\${index}, this.value)">
                        </div>
                        <button class="btn-remove" onclick="removeFile(\${index})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                \`}).join('');
            } else {
                dropzone.classList.remove('has-file');
                fileList.classList.remove('show');
                submitContainer.classList.remove('show');
            }
        }

        function updateFileUuid(index, value) {
            if (selectedFiles[index]) {
                selectedFiles[index].document_uuid = value;
            }
        }

        function removeFile(index) {
            selectedFiles.splice(index, 1);
            updateFileList();
        }

        function updateStep(stepId, status, statusText, extraData) {
            const stepElement = document.getElementById('step-' + stepId);
            const statusElement = document.getElementById('step-' + stepId + '-status');

            stepElement.classList.remove('active', 'completed', 'error');

            if (status === 'active') {
                stepElement.classList.add('active');
                statusElement.innerHTML = '<div class="step-spinner"></div>';
            } else if (status === 'completed') {
                stepElement.classList.add('completed');
                let statusHtml = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
                if (stepId === 'fost' && extraData && Array.isArray(extraData) && extraData.length > 0) {
                    const fostTags = extraData.map(f => '<span class="step-fost-tag">' + formatDate(f) + '</span>').join(' ');
                    statusHtml = fostTags + ' ' + statusHtml;
                }
                statusElement.innerHTML = statusHtml;
            } else if (status === 'error') {
                stepElement.classList.add('error');
                statusElement.textContent = statusText || 'Erreur';
            } else {
                statusElement.textContent = statusText || 'En attente';
            }
        }

        function resetSteps() {
            ['upload', 'ocr', 'analyze', 'fost', 'ocode'].forEach(step => {
                updateStep(step, 'pending', 'En attente');
            });
            // Clear file lists
            ['upload', 'ocr', 'analyze'].forEach(step => {
                const filesEl = document.getElementById('step-' + step + '-files');
                if (filesEl) filesEl.innerHTML = '';
            });
        }

        function initFileList(stepId, files) {
            const filesEl = document.getElementById('step-' + stepId + '-files');
            if (!filesEl) return;
            filesEl.innerHTML = files.map((file, index) =>
                '<div class="step-file" id="step-' + stepId + '-file-' + index + '">' +
                    '<span class="step-file-name">' + file.name + '</span>' +
                    '<span class="step-file-status">En attente</span>' +
                '</div>'
            ).join('');
        }

        function updateFileStatus(stepId, index, status, progressOrTypeDoc) {
            const fileEl = document.getElementById('step-' + stepId + '-file-' + index);
            if (!fileEl) return;

            fileEl.classList.remove('processing', 'completed', 'error', 'uploading');
            const statusEl = fileEl.querySelector('.step-file-status');
            const nameEl = fileEl.querySelector('.step-file-name');

            if (status === 'uploading') {
                fileEl.classList.add('uploading', 'processing');
                const pct = progressOrTypeDoc || 0;
                statusEl.innerHTML = '<div class="upload-progress"><div class="progress-bar"><div class="progress-bar-fill" style="width: ' + pct + '%"></div></div><span class="progress-text">' + pct + '%</span></div>';
            } else if (status === 'processing') {
                fileEl.classList.add('processing');
                statusEl.innerHTML = '<div class="file-spinner"></div> En cours';
            } else if (status === 'completed') {
                fileEl.classList.add('completed');
                // If typeDoc is provided (for analyze step), add tag next to file name
                if (stepId === 'analyze' && progressOrTypeDoc && typeof progressOrTypeDoc === 'string') {
                    const existingTag = nameEl.querySelector('.file-type-tag');
                    if (!existingTag) {
                        nameEl.innerHTML = nameEl.textContent + ' <span class="file-type-tag">' + progressOrTypeDoc + '</span>';
                    }
                }
                statusEl.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Terminé';
            } else if (status === 'error') {
                fileEl.classList.add('error');
                statusEl.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg> Erreur';
            } else {
                statusEl.textContent = 'En attente';
            }
        }

        function updateUploadProgress(index, percent) {
            const fileEl = document.getElementById('step-upload-file-' + index);
            if (!fileEl) return;
            const fillEl = fileEl.querySelector('.progress-bar-fill');
            const textEl = fileEl.querySelector('.progress-text');
            if (fillEl) fillEl.style.width = percent + '%';
            if (textEl) textEl.textContent = percent + '%';
        }

        async function submitAnalyse() {
            if (selectedFiles.length === 0) return;

            const btnSubmit = document.getElementById('btnSubmit');
            const stepsContainer = document.getElementById('stepsContainer');
            const resultsSection = document.getElementById('resultsSection');

            // Disable button and show steps
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner"></span> Traitement...';
            resetSteps();
            stepsContainer.classList.add('show');
            resultsSection.classList.remove('show');

            const totalFiles = selectedFiles.length;
            let uploadedFiles = new Array(totalFiles);
            let ocrResults = new Array(totalFiles);
            let analysisResults = [];
            let fostsValue = [];
            let ocodeResult = null;

            try {
                // Initialize all file lists upfront
                initFileList('upload', selectedFiles);
                initFileList('ocr', selectedFiles);
                initFileList('analyze', selectedFiles);

                // Activate only upload step (OCR will activate when first upload completes, analyze when first OCR completes)
                updateStep('upload', 'active');

                // Track completion for each step
                let uploadCompleted = 0;
                let ocrCompleted = 0;
                let analyzeCompleted = 0;

                // Helper function for upload with progress
                function uploadWithProgress(file, index) {
                    return new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        const formData = new FormData();
                        formData.append('file', file);

                        xhr.upload.onprogress = (e) => {
                            if (e.lengthComputable) {
                                const percent = Math.round((e.loaded / e.total) * 100);
                                updateUploadProgress(index, percent);
                            }
                        };

                        xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                try {
                                    resolve(JSON.parse(xhr.responseText));
                                } catch (e) {
                                    reject(new Error('Erreur parsing upload ' + file.name));
                                }
                            } else {
                                reject(new Error('Erreur upload ' + file.name + ' (HTTP ' + xhr.status + ')'));
                            }
                        };

                        xhr.onerror = () => reject(new Error('Erreur réseau upload ' + file.name));
                        xhr.ontimeout = () => reject(new Error('Timeout upload ' + file.name));

                        xhr.open('POST', '/api/upload');
                        xhr.setRequestHeader('Authorization', 'Basic ' + token);
                        xhr.timeout = 300000; // 5 minutes timeout
                        xhr.send(formData);
                    });
                }

                // Pipeline: each file goes through upload → ocr → analyze independently
                const pipelinePromises = selectedFiles.map(async (file, index) => {
                    // Step 1: Upload with progress
                    updateFileStatus('upload', index, 'uploading', 0);

                    const uploadResult = await uploadWithProgress(file, index);
                    updateFileStatus('upload', index, 'completed');
                    uploadCompleted++;
                    if (uploadCompleted === 1) updateStep('ocr', 'active'); // Activate OCR when first upload completes
                    if (uploadCompleted === totalFiles) updateStep('upload', 'completed');

                    const uploadedFile = {
                        document_uuid: file.document_uuid,
                        document_url: uploadResult.document_url,
                        s3_key: uploadResult.s3_key,
                        name: file.name
                    };
                    uploadedFiles[index] = uploadedFile;

                    // Step 2: OCR (starts immediately after upload)
                    updateFileStatus('ocr', index, 'processing');
                    const ocrResponse = await fetch('/api/summarize/ocr', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + token
                        },
                        body: JSON.stringify({
                            s3_key: uploadedFile.s3_key,
                            debug: true
                        })
                    });

                    if (!ocrResponse.ok) throw new Error('Erreur OCR ' + file.name);
                    const ocrResult = await ocrResponse.json();
                    updateFileStatus('ocr', index, 'completed');
                    ocrCompleted++;
                    if (ocrCompleted === 1) updateStep('analyze', 'active'); // Activate analyze when first OCR completes
                    if (ocrCompleted === totalFiles) updateStep('ocr', 'completed');

                    const ocrData = {
                        document_uuid: uploadedFile.document_uuid,
                        extracted_text: ocrResult.extracted_text,
                        blocks: ocrResult.blocks,
                        name: uploadedFile.name
                    };
                    ocrResults[index] = ocrData;

                    // Step 3: Analyze (starts immediately after OCR)
                    updateFileStatus('analyze', index, 'processing');
                    const analyzeResponse = await fetch('/api/summarize/analyze', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + token
                        },
                        body: JSON.stringify({
                            extracted_text: ocrData.extracted_text,
                            document_uuid: ocrData.document_uuid
                        })
                    });

                    if (!analyzeResponse.ok) throw new Error('Erreur Analyse ' + file.name);
                    const analyzeResult = await analyzeResponse.json();
                    updateFileStatus('analyze', index, 'completed', analyzeResult.type_doc);
                    analyzeCompleted++;
                    if (analyzeCompleted === totalFiles) updateStep('analyze', 'completed');

                    return {
                        ...analyzeResult,
                        _debug_file_name: ocrData.name
                    };
                });

                // Wait for all files to complete their pipeline
                analysisResults = await Promise.all(pipelinePromises);

                // Step 4: FOST identification
                updateStep('fost', 'active');
                const fostResponse = await fetch('/api/summarize/fost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + token
                    },
                    body: JSON.stringify({
                        analysis_result: { documents: analysisResults }
                    })
                });

                if (!fostResponse.ok) throw new Error('Erreur FOST');
                fostsValue = await fostResponse.json();
                updateStep('fost', 'completed', null, fostsValue);

                // Step 5: Analyse de conformité
                updateStep('ocode', 'active');
                const ocodeResponse = await fetch('/api/summarize/ocode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + token
                    },
                    body: JSON.stringify({
                        fosts: fostsValue,
                        documents: analysisResults
                    })
                });

                if (!ocodeResponse.ok) throw new Error('Erreur Analyse de conformité');
                ocodeResult = await ocodeResponse.json();
                updateStep('ocode', 'completed');

                // Build final result
                const result = {
                    documents: analysisResults,
                    fosts: fostsValue,
                    analyse: ocodeResult
                };

                // Hide steps after small delay
                setTimeout(() => {
                    stepsContainer.classList.remove('show');
                }, 500);

                displayAnalyseResults(result);
                resultsSection.classList.add('show');

                // Debug sections - generate accordions per file for OCR text, OCR blocks, and Analyse

                // 1. OCR texte brut (per file)
                const ocrTextAccordionsHtml = ocrResults.map((o, i) =>
                    '<div class="debug-accordion debug-file-accordion" id="accordion-ocrtext-' + i + '">' +
                        '<div class="debug-accordion-header" onclick="toggleAccordion(\\'ocrtext-' + i + '\\')">' +
                            '<span>' + o.name + '</span>' +
                            '<svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                                '<path d="M6 9l6 6 6-6"/>' +
                            '</svg>' +
                        '</div>' +
                        '<div class="debug-accordion-content" id="accordion-content-ocrtext-' + i + '">' +
                            '<pre>' + o.extracted_text + '</pre>' +
                        '</div>' +
                    '</div>'
                ).join('');
                document.getElementById('debugOcrTextAccordions').innerHTML = ocrTextAccordionsHtml;

                // 2. Extraction OCR - blocs JSON (per file)
                const ocrBlocksAccordionsHtml = ocrResults.map((o, i) =>
                    '<div class="debug-accordion debug-file-accordion" id="accordion-ocrblocks-' + i + '">' +
                        '<div class="debug-accordion-header" onclick="toggleAccordion(\\'ocrblocks-' + i + '\\')">' +
                            '<span>' + o.name + '</span>' +
                            '<svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                                '<path d="M6 9l6 6 6-6"/>' +
                            '</svg>' +
                        '</div>' +
                        '<div class="debug-accordion-content" id="accordion-content-ocrblocks-' + i + '">' +
                            '<pre>' + JSON.stringify(o.blocks || [], null, 2) + '</pre>' +
                        '</div>' +
                    '</div>'
                ).join('');
                document.getElementById('debugOcrBlocksAccordions').innerHTML = ocrBlocksAccordionsHtml;

                // 3. Analyse des documents (per file)
                const analyseAccordionsHtml = analysisResults.map((a, i) => {
                    const fileName = a._debug_file_name || ('Document ' + (i + 1));
                    const cleanResult = { ...a };
                    delete cleanResult._debug_file_name;
                    return '<div class="debug-accordion debug-file-accordion" id="accordion-analyse-' + i + '">' +
                        '<div class="debug-accordion-header" onclick="toggleAccordion(\\'analyse-' + i + '\\')">' +
                            '<span>' + fileName + '</span>' +
                            '<svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                                '<path d="M6 9l6 6 6-6"/>' +
                            '</svg>' +
                        '</div>' +
                        '<div class="debug-accordion-content" id="accordion-content-analyse-' + i + '">' +
                            '<pre>' + JSON.stringify(cleanResult, null, 2) + '</pre>' +
                        '</div>' +
                    '</div>';
                }).join('');
                document.getElementById('debugAnalyseAccordions').innerHTML = analyseAccordionsHtml;

                // 4 & 5. FOST and Conformité (global)
                document.getElementById('debugFostContent').textContent = JSON.stringify(fostsValue, null, 2);
                document.getElementById('debugConformiteContent').textContent = JSON.stringify(ocodeResult, null, 2);

                document.getElementById('debugSection').dataset.hasContent = 'true';
                if (debugMode) {
                    document.getElementById('debugSection').classList.add('show');
                }

            } catch (error) {
                console.error('Error:', error);
                // Mark current active step as error
                ['upload', 'ocr', 'analyze', 'fost', 'ocode'].forEach(step => {
                    const el = document.getElementById('step-' + step);
                    if (el.classList.contains('active')) {
                        updateStep(step, 'error', error.message);
                    }
                });
                alert('Erreur: ' + error.message);
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = \`
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                    Lancer l'Analyse
                \`;
            }
        }

        // Display analyse results in structured format
        function displayAnalyseResults(result) {
            const documents = result.documents || [];
            const fosts = result.fosts || [];
            const analyse = result.analyse;

            // Render FOST tags in header
            const fostsContainer = document.getElementById('resultsFosts');
            if (fosts && fosts.length > 0) {
                fostsContainer.innerHTML = fosts.map(fost =>
                    '<span class="tag tag-fost">' + fost + '</span>'
                ).join('');
            } else {
                fostsContainer.innerHTML = '';
            }

            // Render document cards
            const listContainer = document.getElementById('documentsList');
            let cardsHtml = '';

            documents.forEach((doc, index) => {
                const title = doc.document_title || 'Document ' + (index + 1);
                const isExpanded = documents.length === 1; // Auto-expand if only one document

                cardsHtml += '<div class="document-card' + (isExpanded ? ' expanded' : '') + '" id="docCard' + index + '">';

                // Card header (clickable)
                cardsHtml += '<div class="document-card-header" onclick="toggleDocumentCard(' + index + ')">';
                cardsHtml += '<span class="doc-index">' + (index + 1) + '</span>';
                cardsHtml += '<div class="doc-info">';
                cardsHtml += '<h3 class="doc-title">' + title + '</h3>';
                if (doc.document_uuid) {
                    cardsHtml += '<div class="doc-uuid">UUID: ' + doc.document_uuid + '</div>';
                }
                cardsHtml += '</div>';

                // Tags
                cardsHtml += '<div class="doc-tags">';
                if (doc.type_doc) {
                    cardsHtml += '<span class="tag tag-type">' + doc.type_doc + '</span>';
                }
                cardsHtml += '</div>';

                // Expand icon
                cardsHtml += '<svg class="doc-expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
                cardsHtml += '</div>';

                // Card content (collapsible)
                cardsHtml += '<div class="document-card-content">';

                // Resume
                if (doc.document_resume) {
                    cardsHtml += '<div class="result-section">';
                    cardsHtml += '<div class="result-section-title">Résumé</div>';
                    cardsHtml += '<p class="result-resume">' + doc.document_resume + '</p>';
                    cardsHtml += '</div>';
                }

                // Keywords
                if (doc.document_key_words && doc.document_key_words.length > 0) {
                    cardsHtml += '<div class="result-section">';
                    cardsHtml += '<div class="result-section-title">Mots-clés</div>';
                    cardsHtml += '<div class="keywords-container">';
                    doc.document_key_words.forEach(kw => {
                        cardsHtml += '<span class="tag tag-keyword">' + kw + '</span>';
                    });
                    cardsHtml += '</div></div>';
                }

                // Extracted fields
                const hasExtractedFields = doc.Extracted_fields && (
                    (Array.isArray(doc.Extracted_fields) && doc.Extracted_fields.length > 0) ||
                    (typeof doc.Extracted_fields === 'object' && Object.keys(doc.Extracted_fields).length > 0)
                );
                if (hasExtractedFields) {
                    cardsHtml += '<div class="result-section">';
                    cardsHtml += '<div class="result-section-title">Champs extraits</div>';
                    cardsHtml += renderExtractedFields(doc.Extracted_fields);
                    cardsHtml += '</div>';
                }

                cardsHtml += '</div>'; // end card content
                cardsHtml += '</div>'; // end card
            });

            listContainer.innerHTML = cardsHtml;

            // Render global analyse (independent from documents)
            const hasAnalyse = analyse && (
                (Array.isArray(analyse) && analyse.length > 0) ||
                (typeof analyse === 'object' && Object.keys(analyse).length > 0)
            );
            if (hasAnalyse) {
                document.getElementById('analyseContainer').innerHTML = renderAnalyse(analyse);
                document.getElementById('analyseWrapper').style.display = 'block';
            } else {
                document.getElementById('analyseWrapper').style.display = 'none';
            }
        }

        // Toggle document card expansion
        function toggleDocumentCard(index) {
            const card = document.getElementById('docCard' + index);
            if (card) {
                card.classList.toggle('expanded');
            }
        }
    </script>
</body>
</html>
    `;
  }
}
