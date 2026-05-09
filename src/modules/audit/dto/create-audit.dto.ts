import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateAuditDto {
  @IsNotEmpty()
  @IsString()
  event: string;

  @IsNotEmpty()
  @IsString()
  severity: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsInt()
  targetUserId?: number; // El ID del usuario al que vas a auditar
}
