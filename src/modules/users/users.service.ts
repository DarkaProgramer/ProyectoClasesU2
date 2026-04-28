import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) {}

  // 1. Registro de usuario (Usado por AuthService)
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  // 2. Vista de "otros usuarios"
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: {
          select: {
            name: true,
          },
        },
        // Cumpliendo con el PDF: No se exponen correos ni contraseñas
        createdAt: true,
      },
    });
  }

  // 3. Buscar por Email (Uso interno para Auth, no se expone en Controller)
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  // 4. Buscar un usuario específico (Solo datos permitidos)
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true, // El email solo se muestra si el perfil es el propio (validado en controller)
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  // 5. Actualización (Usado para el perfil propio)
  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
