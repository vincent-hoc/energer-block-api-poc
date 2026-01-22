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

        .header-left {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .header-logo img {
            height: 32px;
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
            background-color: #4d65ff;
        }

        .toggle-switch input:checked + .toggle-slider:before {
            transform: translateX(16px);
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
            border-color: #22c55e;
            background: #f0fdf4;
        }

        .dropzone.dragover {
            border-color: #22c55e;
            background: #f0fdf4;
            border-style: solid;
        }

        .dropzone.has-file {
            border-color: #22c55e;
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
            background: #dcfce7;
        }

        .dropzone-icon svg {
            width: 28px;
            height: 28px;
            color: #6b7280;
        }

        .dropzone:hover .dropzone-icon svg,
        .dropzone.dragover .dropzone-icon svg {
            color: #22c55e;
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
            border-color: #4d65ff;
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
            background: #dcfce7;
            color: #16a34a;
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
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .btn-submit.summarize:hover:not(:disabled) {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
            transform: translateY(-1px);
        }

        .btn-submit.analyse {
            background: linear-gradient(135deg, #4d65ff 0%, #6366f1 100%);
            box-shadow: 0 4px 12px rgba(77, 101, 255, 0.3);
        }

        .btn-submit.analyse:hover:not(:disabled) {
            background: linear-gradient(135deg, #3d55ef 0%, #5356e1 100%);
            box-shadow: 0 6px 16px rgba(77, 101, 255, 0.4);
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
            border-top-color: #22c55e;
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
            gap: 12px;
            margin-bottom: 16px;
            flex-wrap: wrap;
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
            background: #e0e7ff;
            color: #4338ca;
        }

        .tag-fost {
            background: #dcfce7;
            color: #16a34a;
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
            border-left: 4px solid #4d65ff;
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
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
            background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
            border: 2px solid #22c55e;
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
            background: #6366f1;
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
            border-left: 4px solid #22c55e;
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
            color: #22c55e;
            background: #dcfce7;
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
            background: #dcfce7;
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
            border-color: #22c55e;
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
            color: #4d65ff;
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
            background: linear-gradient(135deg, #4d65ff 0%, #6366f1 100%);
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
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
            html += '<span class="summary-ok">' + okCount + ' conformes</span>';
            html += '<span class="summary-ko">' + koCount + ' non conformes</span>';
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
    <title>Energer - Test Summarize API</title>
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
        <h1 class="page-title">Test API Summarize</h1>
        <p class="page-subtitle">Deposez un fichier PDF pour tester l'extraction et l'analyse</p>

        <div class="dropzone-card">
            <div class="form-fields">
                <div class="form-field">
                    <label for="vaultUuid">Vault UUID</label>
                    <input type="text" id="vaultUuid" placeholder="UUID du vault">
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

            <div class="loading-container" id="loadingContainer">
                <div class="loading-spinner"></div>
                <p class="loading-text">Traitement en cours<span class="loading-dots"></span></p>
            </div>

            <div class="submit-container" id="submitContainer">
                <button class="btn-submit summarize" id="btnSubmit" onclick="submitSummarize()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    Lancer Summarize
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
            <div class="debug-section" id="debugApiSection" data-has-content="false">
                <div class="debug-accordion" id="accordion-api">
                    <div class="debug-accordion-header" onclick="toggleAccordion('api')">
                        <span>Réponse API complète (JSON)</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-api">
                        <pre id="debugApiContent"></pre>
                    </div>
                </div>
            </div>

            <div class="debug-section" id="debugOcrSection" data-has-content="false">
                <div class="debug-accordion" id="accordion-ocr">
                    <div class="debug-accordion-header" onclick="toggleAccordion('ocr')">
                        <span>debug_OCR (Texte brut)</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-ocr">
                        <pre id="debugOcrContent"></pre>
                    </div>
                </div>
            </div>

            <div class="debug-section" id="debugJsonSection" data-has-content="false">
                <div class="debug-accordion" id="accordion-json">
                    <div class="debug-accordion-header" onclick="toggleAccordion('json')">
                        <span>debug_OCR_JSON (Blocs Textract)</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-json">
                        <pre id="debugJsonContent"></pre>
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

        async function submitSummarize() {
            if (!selectedFile) return;

            const btnSubmit = document.getElementById('btnSubmit');
            const loadingContainer = document.getElementById('loadingContainer');
            const resultsSection = document.getElementById('resultsSection');

            // Disable button and show loading
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner"></span> Traitement...';
            loadingContainer.classList.add('show');
            resultsSection.classList.remove('show');

            try {
                // Upload file
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
                const uploadResult = await uploadResponse.json();

                // Call Summarize API

                const vaultUuid = document.getElementById('vaultUuid').value;
                const documentUuid = document.getElementById('documentUuid').value;
                const fostKey = document.getElementById('fostKey').value;

                const requestBody = {
                    vault_uuid: vaultUuid,
                    document_uuid: documentUuid,
                    document_url: uploadResult.document_url,
                    s3_key: uploadResult.s3_key,
                    async: false,
                    debug: true
                };

                if (fostKey && fostKey.trim() !== '') {
                    requestBody.fost_key = fostKey.trim();
                }

                const summarizeResponse = await fetch('/api/summarize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + token
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!summarizeResponse.ok) throw new Error('Erreur API Summarize');
                const result = await summarizeResponse.json();

                // Hide loading and display results
                loadingContainer.classList.remove('show');

                // Get document data from first document
                const doc = result.documents && result.documents[0] ? result.documents[0] : {};
                const fosts = result.fosts || [];
                const analyse = result.analyse || [];

                // Always show structured display
                document.getElementById('rawJsonSection').classList.remove('show');
                document.getElementById('structuredResults').classList.add('show');

                {
                    // Header: title + type_doc tag + fost tags
                    let headerHtml = '';
                    if (doc.document_title) {
                        headerHtml += '<h2 class="result-title">' + doc.document_title + '</h2>';
                    }
                    if (doc.type_doc) {
                        headerHtml += '<span class="tag tag-type">' + doc.type_doc + '</span>';
                    }
                    if (fosts && fosts.length > 0) {
                        fosts.forEach(fost => {
                            headerHtml += '<span class="tag tag-fost">' + fost + '</span>';
                        });
                    }
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

                // Debug sections (shown at bottom if toggle is enabled)
                // Full API response
                document.getElementById('debugApiContent').textContent = JSON.stringify(result, null, 2);
                document.getElementById('debugApiSection').dataset.hasContent = 'true';
                if (debugMode) {
                    document.getElementById('debugApiSection').classList.add('show');
                } else {
                    document.getElementById('debugApiSection').classList.remove('show');
                }

                // Debug OCR
                if (result.debug_OCR) {
                    document.getElementById('debugOcrContent').textContent = result.debug_OCR;
                    document.getElementById('debugOcrSection').dataset.hasContent = 'true';
                    if (debugMode) {
                        document.getElementById('debugOcrSection').classList.add('show');
                    }
                } else {
                    document.getElementById('debugOcrSection').dataset.hasContent = 'false';
                    document.getElementById('debugOcrSection').classList.remove('show');
                }

                if (result.debug_OCR_JSON) {
                    document.getElementById('debugJsonContent').textContent = JSON.stringify(result.debug_OCR_JSON, null, 2);
                    document.getElementById('debugJsonSection').dataset.hasContent = 'true';
                    if (debugMode) {
                        document.getElementById('debugJsonSection').classList.add('show');
                    }
                } else {
                    document.getElementById('debugJsonSection').dataset.hasContent = 'false';
                    document.getElementById('debugJsonSection').classList.remove('show');
                }

                resultsSection.classList.add('show');

            } catch (error) {
                console.error('Error:', error);
                loadingContainer.classList.remove('show');
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
                    Lancer Summarize
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
    <title>Energer - Test Analyse API</title>
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
        <h1 class="page-title">Test API Analyse</h1>
        <p class="page-subtitle">Deposez plusieurs fichiers PDF pour tester l'analyse complete d'un dossier</p>

        <div class="dropzone-card">
            <div class="form-fields" style="grid-template-columns: 1fr;">
                <div class="form-field">
                    <label for="vaultUuid">Vault UUID</label>
                    <input type="text" id="vaultUuid" placeholder="UUID du vault">
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

            <div class="progress-container" id="progressContainer">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <p class="progress-text" id="progressText">Traitement en cours...</p>
            </div>

            <div class="loading-container" id="loadingContainer">
                <div class="loading-spinner"></div>
                <p class="loading-text">Analyse en cours<span class="loading-dots"></span></p>
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
            <div class="debug-section" id="debugApiSection" data-has-content="false">
                <div class="debug-accordion" id="accordion-api">
                    <div class="debug-accordion-header" onclick="toggleAccordion('api')">
                        <span>Réponse API complète (JSON)</span>
                        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                    <div class="debug-accordion-content" id="accordion-content-api">
                        <pre id="debugApiContent"></pre>
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

        // Initialize vault UUID
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

        async function submitAnalyse() {
            if (selectedFiles.length === 0) return;

            const btnSubmit = document.getElementById('btnSubmit');
            const progressContainer = document.getElementById('progressContainer');
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');
            const resultsSection = document.getElementById('resultsSection');

            // Disable button and show progress
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner"></span> Traitement...';
            progressContainer.classList.add('show');
            resultsSection.classList.remove('show');

            try {
                // Get vault UUID
                const vaultUuid = document.getElementById('vaultUuid').value;

                // Upload all files and get their info
                const uploadedFiles = [];
                const totalFiles = selectedFiles.length;

                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    const progress = ((i + 1) / totalFiles) * 50;
                    progressFill.style.width = progress + '%';
                    progressText.textContent = 'Upload fichier ' + (i + 1) + '/' + totalFiles + '...';

                    const formData = new FormData();
                    formData.append('file', file);

                    const uploadResponse = await fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + token
                        },
                        body: formData
                    });

                    if (!uploadResponse.ok) throw new Error('Erreur upload ' + file.name);
                    const uploadResult = await uploadResponse.json();
                    uploadedFiles.push({
                        document_uuid: file.document_uuid,
                        document_url: uploadResult.document_url,
                        s3_key: uploadResult.s3_key
                    });
                }

                // Hide progress bar after uploads complete, show loading spinner
                progressContainer.classList.remove('show');
                const loadingContainer = document.getElementById('loadingContainer');
                loadingContainer.classList.add('show');

                // Call Analyse API

                const analyseBody = {
                    vault_uuid: vaultUuid,
                    async: false,
                    documents: uploadedFiles.map(f => ({
                        document_uuid: f.document_uuid,
                        document_url: f.document_url,
                        s3_key: f.s3_key
                    }))
                };

                const analyseResponse = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + token
                    },
                    body: JSON.stringify(analyseBody)
                });

                if (!analyseResponse.ok) throw new Error('Erreur API Analyse');
                const result = await analyseResponse.json();

                // Hide loading spinner
                loadingContainer.classList.remove('show');

                displayAnalyseResults(result);
                resultsSection.classList.add('show');

                // Debug: store full API response
                document.getElementById('debugApiContent').textContent = JSON.stringify(result, null, 2);
                document.getElementById('debugApiSection').dataset.hasContent = 'true';
                if (debugMode) {
                    document.getElementById('debugApiSection').classList.add('show');
                }

            } catch (error) {
                console.error('Error:', error);
                progressContainer.classList.remove('show');
                document.getElementById('loadingContainer').classList.remove('show');
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
