import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsUrl } from 'class-validator';

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
  debug_ocr?: boolean;

  @IsString()
  @IsOptional()
  fost_key?: string;
}
