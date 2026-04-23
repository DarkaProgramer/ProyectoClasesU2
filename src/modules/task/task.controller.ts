import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

// Definimos una interfaz pequeña para que TS sepa qué tiene el usuario
interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    // añade otros campos si los necesitas
  };
}

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks() {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async getTask(@Param('id', ParseIntPipe) id: number) {
    return await this.taskService.findOne(id);
  }

  @Post()
  async insertTask(@Body() data: CreateTaskDto, @Req() req: RequestWithUser) {
    // Ahora TS sabe que 'req.user.id' es un número
    const userId = req.user.id;

    return await this.taskService.create(data, userId);
  }

  @Put(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
  ) {
    return await this.taskService.update(id, data);
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    return await this.taskService.remove(id);
  }
}
