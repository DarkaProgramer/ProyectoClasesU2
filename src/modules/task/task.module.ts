import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  // Importamos DatabaseModule para que TaskService pueda usar el DatabaseService (Prisma)
  imports: [DatabaseModule],
  controllers: [TaskController],
  providers: [TaskService],
  // Exportamos el servicio por si algún otro módulo (como Audit) necesita usarlo después
  exports: [TaskService],
})
export class TaskModule {}
