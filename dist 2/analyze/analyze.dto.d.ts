declare class DocumentInput {
    document_uuid: string;
    document_url: string;
}
export declare class AnalyzeDto {
    vault_uuid: string;
    documents: DocumentInput[];
    async?: boolean;
}
export {};
