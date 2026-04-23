import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { DatabaseModule } from '../../database/database.module'; // Ajusta la ruta si es necesario

@Module({
  imports: [DatabaseModule], // Importante para que el servicio pueda usar la DB
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], // Por si otros módulos necesitan usar tareas
})
export class TaskModule {}
