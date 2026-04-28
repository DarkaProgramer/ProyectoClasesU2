// src/modules/audit/audit.module.ts
import { Module, Global } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { DatabaseModule } from '../../database/database.module';

@Global() // Lo hacemos global para que Auth y Task lo usen fácilmente
@Module({
  imports: [DatabaseModule],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
