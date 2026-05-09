import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    { message: 'Formato de correo inválido. "No lo sé Rick, parece falso".' },
  )
  @IsNotEmpty({
    message: 'Olvidaste poner tu correo. "¡Rayos, ya nos exhibiste!"',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message:
      'La contraseña es obligatoria para entrar. "¡Esos bastardos me mintieron!"',
  })
  @MinLength(1)
  password: string;
}
