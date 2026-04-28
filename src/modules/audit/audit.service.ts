// src/modules/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditQueryDto } from './audit-query.dto';

@Injectable()
export class AuditService {
  constructor(private prisma: DatabaseService) {}

  // Método para registrar eventos
  async create(data: {
    event: string;
    severity: string;
    details?: string;
    userId?: number;
    taskId?: number;
  }) {
    // Agregamos 'await' para cumplir con la regla de ESLint
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.prisma.auditLog.create({
      data: {
        event: data.event,
        severity: data.severity,
        details: data.details,
        userId: data.userId,
      },
    });
  }

  // Interfaz de Consulta con filtros
  async findAll(query: AuditQueryDto) {
    const { userId, severity, startDate, endDate } = query;

    // Agregamos 'await' y verificamos que sea 'auditLog' (CamelCase)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return await this.prisma.auditLog.findMany({
      where: {
        userId: userId ? parseInt(userId) : undefined,
        severity: severity || undefined,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
