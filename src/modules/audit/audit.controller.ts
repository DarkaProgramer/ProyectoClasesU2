// src/modules/audit/audit.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditQueryDto } from './audit-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('ADMIN') // Solo el Admin puede ver los logs (Punto 40)
  findAll(@Query() query: AuditQueryDto) {
    return this.auditService.findAll(query);
  }

  // NOTA: No creamos métodos DELETE ni PATCH para cumplir con "Integridad del Log"
}
