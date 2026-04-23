import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Request } from 'express';

// Interfaces para cumplir con las reglas estrictas de ESLint y tipos
interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
  name?: string;
}

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

interface AuthResponse {
  message: string;
  access_token: string;
  user: AuthenticatedUser;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro de nuevos usuarios' })
  async register(@Body() data: RegisterDto): Promise<AuthResponse> {
    // 1. Obtenemos el usuario creado desde el servicio
    const userCreated = await this.authSvc.register(data);

    // 2. Construimos la respuesta manual para evitar errores de 'scope' y tipos
    return {
      message: 'Usuario registrado exitosamente',
      access_token: '', // El registro base no suele devolver token
      user: {
        id: userCreated.id,
        email: userCreated.email,
        role: userCreated.role,
        name: userCreated.name,
      },
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  async login(@Body() credentials: LoginDto): Promise<AuthResponse> {
    // Usamos unknown para permitir la conversión segura al tipo AuthResponse
    const result = await this.authSvc.login(credentials);
    return result as unknown as AuthResponse;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getProfile(@Req() req: RequestWithUser): AuthenticatedUser {
    return req.user;
  }

  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin-dashboard')
  @ApiOperation({ summary: 'Endpoint restringido para administradores' })
  getAdminData() {
    return {
      message: 'Acceso concedido al panel de administración',
      timestamp: new Date().toISOString(),
    };
  }
}
