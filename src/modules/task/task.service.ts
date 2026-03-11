import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {

  private tasks: any[] = [];

  getTasks() {
    return this.tasks;
  }

  getTaskById(id: number) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    return task;
  }

  insert(task: CreateTaskDto) {
    const newTask = { id: Date.now(), ...task };
    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, taskUpdate: UpdateTaskDto) {
    const task = this.getTaskById(id);
    Object.assign(task, taskUpdate);
    return task;
  }

  delete(id: number) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new HttpException('No se puede eliminar la tarea', HttpStatus.NOT_FOUND);
    }
    return this.tasks.splice(index, 1)[0];
  }
}