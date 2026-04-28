import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  activityName: string; // Coincide con tu esquema de Prisma

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  importance?: number;

  @IsString()
  @IsOptional()
  status?: string; // Ejemplo: 'PENDING', 'IN_PROGRESS', 'COMPLETED'
}
