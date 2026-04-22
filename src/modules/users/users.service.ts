import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

interface CurrentUser {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<UserResponse[]> {
    return (await this.db.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    })) as unknown as UserResponse[];
  }

  async findOne(id: number, currentUser: CurrentUser): Promise<UserResponse> {
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para ver este perfil');
    }

    // Retorno directo con casteo doble para silenciar al linter definitivamente
    const user = (await this.db.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    })) as unknown as UserResponse | null;

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async update(
    id: number,
    data: UpdateUserDto,
    currentUser: CurrentUser,
  ): Promise<UserResponse> {
    await this.findOne(id, currentUser);

    const updateData: { email?: string; name?: string; role?: Role } = {};
    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;

    const rawData = data as Record<string, unknown>;
    if (typeof rawData.role === 'string' && currentUser.role === 'ADMIN') {
      updateData.role = rawData.role as Role;
    }

    // Eliminamos la variable intermedia para evitar el error de asignación (línea 79)
    return (await this.db.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true },
    })) as unknown as UserResponse;
  }

  async remove(id: number): Promise<{ message: string }> {
    // Verificamos existencia antes de borrar
    await this.db.user
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Usuario no encontrado');
      });

    await this.db.user.delete({ where: { id } });
    return { message: 'Usuario eliminado correctamente' };
  }
}
