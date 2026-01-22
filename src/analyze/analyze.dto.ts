import { IsString, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DocumentInput {
  @IsString()
  document_uuid: string;

  @IsString()
  document_url: string;

  @IsOptional()
  @IsString()
  s3_key?: string;
}

export class AnalyzeDto {
  @IsString()
  vault_uuid: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentInput)
  documents: DocumentInput[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  async?: boolean;
}
