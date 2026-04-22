import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: 'TU_CLAVE_SECRETA_SUPER_SEGURA',
      signOptions: { expiresIn: '1h' }, // El token dura 1 hora
    }),
  ],
  providers: [AuthService, JwtStrategy], // IMPORTANTE: Agregar JwtStrategy aquí
  controllers: [AuthController],
})
export class AuthModule {}
