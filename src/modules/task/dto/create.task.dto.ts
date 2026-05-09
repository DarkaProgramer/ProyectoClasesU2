import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  // 1. Tipamos 'value' como string para que ESLint sepa que el retorno es seguro
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.slice(0, 50) : value,
  )
  activityName: string;

  @IsString()
  @IsOptional()
  // 2. Hacemos lo mismo para la descripción
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.slice(0, 250) : value,
  )
  description?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  importance?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
