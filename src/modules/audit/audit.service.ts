import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditQueryDto } from './dto/audit-query.dto';
import { CreateAuditDto } from './dto/create-audit.dto';

@Injectable()
export class AuditService {
  constructor(private prisma: DatabaseService) {}

  // Método para crear logs (Automáticos y el Protocolo Ángel)
  async create(data: CreateAuditDto & { userId?: number }) {
    return await this.prisma.auditLog.create({
      data: {
        event: data.event,
        severity: data.severity,
        details: data.details,
        userId: data.userId, // Admin que hace la auditoría
        targetUserId: data.targetUserId, // Usuario auditado
      },
    });
  }

  // Consulta para el Dashboard con toda la información
  async findAll(query: AuditQueryDto) {
    const { userId, severity } = query;

    return await this.prisma.auditLog.findMany({
      where: {
        // IMPORTANTE: Cambiamos userId por targetUserId
        // para que el admin vea a quién auditó, no solo sus propios logs.
        targetUserId: userId ? Number(userId) : undefined,
        severity: severity || undefined,
      },
      include: {
        // Estos nombres deben coincidir con los de tu nuevo Prisma
        user: { select: { name: true, email: true } }, // El Admin (Sujeto)
        targetUser: { select: { name: true, email: true } }, // El Usuario (Objeto)
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
