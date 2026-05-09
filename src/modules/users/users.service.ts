import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditService } from '../audit/audit.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: DatabaseService,
    private auditService: AuditService,
  ) {}

  // 1. Registro de usuario
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          roleId: 2, // Seguridad: Siempre User al registrarse
        },
      });

      await this.auditService.create({
        event: 'Usuario Creado',
        severity: 'Baja',
        details: `Nuevo registro: ${newUser.email}`,
        userId: newUser.id,
      });

      return newUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Este correo ya tiene dueño. "¡Vaya, no encuentro fallas en su lógica!", pero usa otro email.',
          );
        }
      }
      throw new InternalServerErrorException(
        'Algo explotó atrás. "¡Houston, tenemos un problema!", llama al admin.',
      );
    }
  }

  // 2. Vista de usuarios
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        role: { select: { name: true } },
        createdAt: true,
      },
    });
  }

  // 3. Buscar por Email
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  // 4. Buscar un usuario específico
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: { select: { name: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Ese usuario es un fantasma. "¿A dónde tan peinado?", el ID ${id} no existe en la DB.`,
      );
    }
    return user;
  }

  // 5. Actualización con Auditoría y Select para el Front
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          name: true,
          email: true,
          roleId: true,
          role: { select: { name: true } }, // 👈 Ajuste: El Front ahora recibe el rol actualizado
        },
      });

      // Registro de auditoría para actualización
      const isRoleChange = updateUserDto.roleId !== undefined;

      await this.auditService.create({
        event: isRoleChange ? 'Cambio de Rol' : 'Usuario Actualizado',
        severity: isRoleChange ? 'Media' : 'Baja',
        details: `Se actualizaron datos de: ${updatedUser.email}. ${isRoleChange ? '¡Ojo con los permisos!' : ''}`,
        userId: id,
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Este correo ya está en uso por otro usuario. "¡Rayos, ya nos exhibiste!"',
          );
        }
        if (error.code === 'P2025') {
          throw new NotFoundException(
            'Intentas editar a alguien que no existe. "¿A dónde tan peinado?", ese ID es fantasma.',
          );
        }
      }
      throw new InternalServerErrorException(
        'No se pudo actualizar. "¡Esos bastardos me mintieron!", algo salió mal en el servidor.',
      );
    }
  }
}
