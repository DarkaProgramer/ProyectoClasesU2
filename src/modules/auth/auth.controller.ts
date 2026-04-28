import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // Cumple con "Requisitos de autenticación y Registro" [cite: 13]
  async register(@Body() registerDto: RegisterDto) {
    // La validación de fortaleza de contraseña ocurre en el DTO [cite: 16]
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  // Implementación de manejo de sesiones (JWT) [cite: 17]
  async login(@Body() loginDto: LoginDto) {
    // Solo recibimos email y password, evitando inyecciones mediante el DTO [cite: 33]
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
