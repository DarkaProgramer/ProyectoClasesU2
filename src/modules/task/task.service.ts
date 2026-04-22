import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export interface TaskResponse {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  userId: number;
  createdAt: Date;
}

@Injectable()
export class TaskService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<TaskResponse[]> {
    return (await this.db.task.findMany()) as unknown as TaskResponse[];
  }

  async findOne(id: number): Promise<TaskResponse> {
    const task = (await this.db.task.findUnique({
      where: { id },
    })) as unknown as TaskResponse | null;

    if (!task) {
      throw new NotFoundException(`La tarea con ID ${id} no existe`);
    }

    return task;
  }

  async create(data: CreateTaskDto, userId: number): Promise<TaskResponse> {
    return (await this.db.task.create({
      data: {
        title: data.name, // Mapeamos 'name' del DTO al 'title' de la DB
        description: data.description,
        completed: false, // Por defecto al crear
        userId: userId, // Usamos 'userId' como está en tu esquema
      },
    })) as unknown as TaskResponse;
  }

  async update(id: number, data: UpdateTaskDto): Promise<TaskResponse> {
    await this.findOne(id);

    // Mapeamos los campos que vienen del DTO a los de tu Prisma Schema
    return (await this.db.task.update({
      where: { id },
      data: {
        title: data.name,
        description: data.description,
        completed: data.priority, // Si tu DTO usa 'priority' para el estado
      },
    })) as unknown as TaskResponse;
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.db.task.delete({ where: { id } });
    return { message: 'Tarea eliminada correctamente' };
  }
}
