import { Body, Controller, Delete, HttpException, Param, Post, Put,ParseIntPipe, HttpStatus } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/tasks')
@ApiTags("Task")
export class TaskController {
  constructor(private taskSvc: TaskService) {}

  @Get()
  public async getTasks(): Promise<any> {
    return this.taskSvc.getTasks();
  }
  
@Get(':id')
public async getTasksById(@Param('id', ParseIntPipe) id: number): Promise<any> {
  const result = await this.taskSvc.getTaskById(id);
  console.log('resultado', result);

  if (result == undefined) {
    throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
  }
  
  return result;
}

  @Post()
  @ApiOperation({summary: 'Inserte una tarea en la base de datos'})
  public async insertTask(@Body() task: CreateTaskDto) {
    const result = this.taskSvc.insert(task);

    if (result == undefined)
    return this.taskSvc.insert(task);
  }

  @Put(':id')
  public async updateTask(@Param("id") id: string, @Body() task: UpdateTaskDto): Promise<any> {  // Cambiado a async
    return this.taskSvc.update(parseInt(id), task);
  }

  @Delete(':id')
  public async deleteTask(@Param('id') id: string): Promise<any> {  // Cambiado a async
    return this.taskSvc.delete(parseInt(id));
  }
}