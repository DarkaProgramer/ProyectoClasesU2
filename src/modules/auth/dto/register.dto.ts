import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail(
    {},
    {
      message:
        'Eso no es un correo. "¡Qué elegancia la de Francia!", pon uno real.',
    },
  )
  @IsNotEmpty({
    message:
      'El correo no puede estar vacío. "¡Vaya, no encuentro fallas en su lógica!"',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria. "¡Oblígame, prro!"' })
  @MinLength(8, {
    message:
      'Tu contraseña es muy pequeña. "¡Qué pequeña es!", mínimo 8 caracteres.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña es muy débil. "¡Poder ilimitado!" necesitas mayúsculas y números o caracteres especiales.',
  })
  password: string;

  @IsString()
  @IsNotEmpty({
    message:
      'Tu nombre es necesario. "¿A dónde tan peinado?", dinos quién eres.',
  })
  name: string;
}
