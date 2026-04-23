import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { Role, User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  role: Role;
}

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  private mapToResponse(user: User): UserResponse {
    return {
      id: Number(user.id),
      email: String(user.email),
      name: user.name ? String(user.name) : null,
      role: user.role,
    };
  }

  async create(data: RegisterDto): Promise<UserResponse> {
    const existingUser = await this.db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await this.db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: Role.USER,
      },
    });

    return this.mapToResponse(newUser);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.db.user.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.db.user.findMany();
    return users.map((u) => this.mapToResponse(u));
  }

  async findOne(
    id: number,
    currentUser: { id: number; role: Role },
  ): Promise<UserResponse> {
    if (currentUser.id !== id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('No tienes permiso para ver este perfil');
    }

    const user = await this.db.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.mapToResponse(user);
  }

  async update(
    id: number,
    data: UpdateUserDto & { role?: Role },
    currentUser: { id: number; role: Role },
  ): Promise<UserResponse> {
    await this.findOne(id, currentUser);

    const updateData: Prisma.UserUpdateInput = {};
    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;
    if (data.role && currentUser.role === Role.ADMIN) {
      updateData.role = data.role;
    }

    const updatedUser = await this.db.user.update({
      where: { id },
      data: updateData,
    });

    return this.mapToResponse(updatedUser);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.db.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    try {
      await this.db.user.delete({ where: { id } });
      return { message: 'Usuario eliminado correctamente' };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`No se pudo eliminar: ${message}`);
    }
  }
}
