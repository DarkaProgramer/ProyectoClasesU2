import {
  IsString,
  IsBoolean,
  MaxLength,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(250)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsBoolean()
  @IsOptional()
  priority?: boolean;
}
