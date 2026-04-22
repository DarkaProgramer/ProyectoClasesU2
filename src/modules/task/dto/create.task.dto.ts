import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250) // Basado en tu Prisma Schema (@db.VarChar(250))
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500) // Basado en tu Prisma Schema (@db.VarChar(500))
  description?: string;

  @IsBoolean()
  @IsOptional()
  priority?: boolean;
}
