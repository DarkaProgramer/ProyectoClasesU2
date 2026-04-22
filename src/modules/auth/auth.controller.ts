import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

// Interfaces para cumplir con las reglas estrictas de ESLint
interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
}

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

interface AuthResponse {
  message?: string;
  access_token?: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro de nuevos usuarios' })
  async register(@Body() data: RegisterDto): Promise<AuthResponse> {
    return (await this.authSvc.register(data)) as unknown as AuthResponse;
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  async login(@Body() credentials: LoginDto): Promise<AuthResponse> {
    return (await this.authSvc.login(credentials)) as unknown as AuthResponse;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getProfile(@Request() req: RequestWithUser): AuthenticatedUser {
    return req.user;
  }

  @ApiBearerAuth()
  @Roles('ADMIN') // Etiqueta la ruta para que solo ADMIN pueda entrar
  @UseGuards(JwtAuthGuard, RolesGuard) // El RolesGuard verifica la etiqueta anterior
  @Get('admin-dashboard')
  @ApiOperation({ summary: 'Endpoint restringido para administradores' })
  getAdminData() {
    return {
      message: 'Acceso concedido al panel de administración',
      timestamp: new Date().toISOString(),
    };
  }
}
