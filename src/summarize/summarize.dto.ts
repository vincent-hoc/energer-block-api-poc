import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SummarizeDto {
  @IsString()
  @IsNotEmpty()
  vault_uuid: string;

  @IsString()
  @IsNotEmpty()
  document_uuid: string;

  @IsUrl()
  @IsNotEmpty()
  document_url: string;

  @IsBoolean()
  @IsOptional()
  async?: boolean;

  @IsBoolean()
  @IsOptional()
  debug?: boolean;

  @IsString()
  @IsOptional()
  fost_key?: string;

  @IsString()
  @IsOptional()
  s3_key?: string;
}

// Step 1: OCR
export class OcrDto {
  @IsString()
  @IsNotEmpty()
  s3_key: string;

  @IsBoolean()
  @IsOptional()
  debug?: boolean;
}

// Step 2: Analyze (Chatbase summarization)
export class AnalyzeTextDto {
  @IsString()
  @IsNotEmpty()
  extracted_text: string;

  @IsString()
  @IsOptional()
  document_uuid?: string;
}

// Step 3: FOST identification
export class FostDto {
  @IsNotEmpty()
  analysis_result: any;
}

// Step 4: OCODE analysis
export class OcodeDto {
  @IsArray()
  @IsNotEmpty()
  fosts: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  documents: any[];
}
