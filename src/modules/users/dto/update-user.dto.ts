import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { IsOptional, IsString, IsInt, IsEmail } from 'class-validator';

// Hereda las validaciones de RegisterDto pero las hace opcionales [cite: 60]
export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  // Solo un Admin debería poder cambiar esto en la lógica del controlador [cite: 29]
  roleId?: number;
}
