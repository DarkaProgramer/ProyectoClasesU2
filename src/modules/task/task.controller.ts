import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
  async insertTask(@Body() data: CreateTaskDto) {
    // Nota: Aquí deberías sacar el ID del usuario del Token (JWT)
    // Por ahora pondremos uno fijo o el que tú manejes para pruebas
    const userId = 1;
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
