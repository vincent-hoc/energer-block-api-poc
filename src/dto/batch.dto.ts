import { IsString, IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class BatchDto {
  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  startIndex?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  fileCount?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  debug?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxParallelProcessing?: number;
}
