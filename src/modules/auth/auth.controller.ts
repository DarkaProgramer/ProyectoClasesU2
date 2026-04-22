import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

// Definimos la interfaz para que el controlador sepa qué esperar
interface AuthResponse {
  message?: string;
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
    // Retornamos directamente para evitar la asignación intermedia insegura
    return (await this.authSvc.register(data)) as unknown as AuthResponse;
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  async login(@Body() credentials: LoginDto): Promise<AuthResponse> {
    // Retornamos directamente para evitar el error de "Unsafe assignment"
    return (await this.authSvc.login(credentials)) as unknown as AuthResponse;
  }
}
