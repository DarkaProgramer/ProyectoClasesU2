import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService, UserResponse } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios (Solo ADMIN)' })
  async findAll(): Promise<UserResponse[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID (Dueño o ADMIN)' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: any,
  ): Promise<UserResponse> {
    return await this.usersService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario (Dueño o ADMIN)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: any,
  ): Promise<UserResponse> {
    return await this.usersService.update(id, updateUserDto, user);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario (Solo ADMIN)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}
