import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class CreateResiduoDto {
  @ApiProperty({ description: 'Material', example: 'Plástico' })
  @IsNotEmpty({ message: 'El material es requerido' })
  @IsString({ message: 'El material debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El material debe tener entre 2 y 100 caracteres' })
  material: string;

  @ApiProperty({ description: 'Puntos por kg', example: 100 })
  @IsNotEmpty({ message: 'Los puntos por kg son requeridos' })
  @IsNumber({ allowInfinity: false }, { message: 'Los puntos por kg deben ser un número' })
  @IsPositive({ message: 'Los puntos por kg deben ser un número positivo' })
  @IsInt({ message: 'Los puntos por kg deben ser un número entero' })
  puntosKg: number;
}
export class UpdateResiduoDto extends PartialType(CreateResiduoDto) {}
