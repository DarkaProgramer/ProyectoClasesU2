import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async register(dto: RegisterDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return {
      message:
        '¡Usuario registrado exitosamente! "Vamo a calmarno", ya puedes iniciar sesión.',
    };
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);

    // 1. Validar si el usuario existe
    if (!user) {
      await this.auditService.create({
        event: 'Login Fallido',
        severity: 'Alta',
        details: `Intento de acceso: El usuario ${email} no existe.`,
      });

      throw new NotFoundException(
        'Ese usuario no existe en nuestra base de datos. "¡Oblígame, prro!" o regístrate bien.',
      );
    }

    // 2. Validar si la contraseña coincide
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      await this.auditService.create({
        event: 'Login Fallido',
        severity: 'Crítica',
        userId: user.id,
        details: `Contraseña incorrecta para el usuario: ${email}`,
      });

      throw new UnauthorizedException(
        '¡Error de inicio de sesión! Tu contraseña es incorrecta. "No lo sé Rick, parece falso".',
      );
    }

    // 3. Login Exitoso - El momento de la verdad
    // Forzamos el nombre del rol a Mayúsculas para que el Front no se confunda
    const roleName =
      (user.role as { name: string })?.name?.toUpperCase() || 'USER';

    const payload = {
      sub: user.id, // Esto será el 'id' en tu JwtStrategy (si ya lo cambiaste)
      email: user.email,
      role: roleName, // 'ADMIN' o 'USER'
    };

    await this.auditService.create({
      event: 'Login Exitoso',
      severity: 'Baja',
      userId: user.id,
      details: `Usuario ${user.email} ha iniciado sesión con rol ${roleName}. "¡Me sirve!"`,
    });

    return {
      access_token: this.jwtService.sign(payload),
      // Enviamos también el user plano para que el Front lo guarde fácil en el Contexto
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: roleName,
      },
    };
  }
}
