import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // Esto permite que no tengas que importarlo en cada módulo
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // ¡Importante para que AuthService lo use!
})
export class DatabaseModule {}
