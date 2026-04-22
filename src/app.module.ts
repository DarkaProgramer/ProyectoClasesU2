import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module'; // Importa el nuevo módulo

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule], // Agrégalo aquí
})
export class AppModule {}
