import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  // Inyectamos DatabaseService
  constructor(private db: DatabaseService) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    return this.db.task.create({
      data: {
        // Mapeamos manualmente para asegurar que activityName se guarde correctamente
        activityName: createTaskDto.activityName,
        description: createTaskDto.description,
        importance: createTaskDto.importance,
        status: createTaskDto.status || 'PENDING',
        userId: userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.db.task.findMany({
      where: { userId },
    });
  }

  async findOne(id: number, userId: number) {
    const task = await this.db.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Tarea no encontrada');

    if (task.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver esta tarea');
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    await this.findOne(id, userId);

    return this.db.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.db.task.delete({ where: { id } });
  }
}
