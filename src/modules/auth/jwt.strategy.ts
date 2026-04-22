import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';

interface UserPayload {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly db: DatabaseService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

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

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
