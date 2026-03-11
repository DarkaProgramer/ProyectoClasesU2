import { IsBoolean, IsNotEmpty, IsNumber, IsString, isString, MaxLength, MinLength, IsInt } from 'class-validator';

export class UpdateTaskDto {
  @IsString({message:'nombre requerido'})
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsString({message:'nombre requerido'})
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  description?: string;

  
  @IsNotEmpty()
  @IsBoolean()
  priority?: boolean;


}
