import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, isString, MaxLength, MinLength, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsString({message:'nombre requerido'})
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({description: 'name', example: 'Jose'})
  name: string;

  @IsString({message:'nombre requerido'})
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({description: 'description', example: 'This is a description'})
  description: string;

  
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({description: 'priority', example: 'false'})
  priority: boolean;

  @IsNumber()
  @IsInt()
  @ApiProperty({description: 'user_id', example: 1})
  user_id: number;
}

//! git commit -a -m "fix:Uso de validaciones y CRUD funcional"
