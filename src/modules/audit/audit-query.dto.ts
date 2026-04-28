// src/modules/audit/dto/audit-query.dto.ts
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class AuditQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  severity?: string; // "Alta", "Media", "Baja"

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
