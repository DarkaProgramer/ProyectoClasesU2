import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.service';

// Definimos la estructura del usuario para que ESLint no sospeche
interface UserPayload {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly db: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TU_CLAVE_SECRETA_SUPER_SEGURA',
    });
  }

  // Validamos el payload del token
  async validate(payload: {
    sub: number;
    email: string;
  }): Promise<UserPayload> {
    const user = (await this.db.user.findUnique({
      where: { id: payload.sub },
    })) as unknown as UserPayload | null;

    if (!user) {
      throw new UnauthorizedException('Token no válido o usuario inexistente');
    }

    // Retornamos los datos que se inyectarán en req.user
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
