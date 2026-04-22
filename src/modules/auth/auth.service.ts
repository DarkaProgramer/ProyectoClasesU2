import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

interface UserFromDb {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async register(data: RegisterDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    try {
      const user = (await this.db.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          role: 'USER',
        },
      })) as unknown as UserFromDb;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch {
      throw new BadRequestException(
        'El usuario ya existe o los datos son inválidos',
      );
    }
  }

  async login(credentials: LoginDto) {
    const user = (await this.db.user.findUnique({
      where: { email: credentials.email },
    })) as unknown as UserFromDb | null;

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
