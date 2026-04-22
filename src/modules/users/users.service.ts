import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';

// Exportamos para que el controlador pueda reconocer el tipo de retorno
export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<UserResponse[]> {
    const users = (await this.db.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    })) as unknown as UserResponse[];

    return users;
  }

  async findOne(id: number): Promise<UserResponse> {
    const user = (await this.db.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    })) as unknown as UserResponse | null;

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponse> {
    await this.findOne(id);

    const updatedUser = (await this.db.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true },
    })) as unknown as UserResponse;

    return updatedUser;
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.db.user.delete({ where: { id } });
    return { message: 'Usuario eliminado correctamente' };
  }
}
