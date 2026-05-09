import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditQueryDto } from './dto/audit-query.dto';
import { CreateAuditDto } from './dto/create-audit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express'; // Importamos el tipo Request de Express

// Definimos una interfaz pequeña para que TypeScript sepa que el usuario tiene un ID
interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('ADMIN')
  findAll(@Query() query: AuditQueryDto) {
    return this.auditService.findAll(query);
  }

  @Post()
  @Roles('ADMIN')
  async createManual(
    @Body() createAuditDto: CreateAuditDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.auditService.create({
      ...createAuditDto,
      userId: req.user.id, // ID del Admin que sesión iniciada
    });
  }
}
