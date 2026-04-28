import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    private auditService: AuditService, // <--- Inyectado
  ) {}

  async register(dto: RegisterDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return { message: 'Usuario registrado exitosamente' };
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = {
        sub: user.id,
        email: user.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        role: user.role?.name || 'USER',
      };

      // REGISTRO DE AUDITORÍA: Login Exitoso
      await this.auditService.create({
        event: 'Login Exitoso',
        severity: 'Baja',
        userId: user.id,
        details: `Usuario ${user.email} ha iniciado sesión.`,
      });

      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    // REGISTRO DE AUDITORÍA: Login Fallido (Intento de acceso)
    await this.auditService.create({
      event: 'Login Fallido',
      severity: 'Alta',
      details: `Intento de acceso no autorizado para: ${email}`,
    });

    throw new UnauthorizedException('Credenciales incorrectas');
  }
}
