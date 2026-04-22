import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importa esto
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Esto hace que el .env esté disponible en toda la app
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
