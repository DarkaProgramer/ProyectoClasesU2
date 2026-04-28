import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsInt({ message: 'El ID del rol debe ser un número entero' }) // Validación estricta de tipo
  roleId?: number;
}
