import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID, Length, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRecompensaDto {
  @ApiProperty({ description: 'Titulo', example: 'Recompensa 1' })
  @IsString({ message: 'El titulo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El titulo es requerido' })
  @Length(2, 100, { message: 'El titulo debe tener entre 2 y 100 caracteres' })
  titulo: string;

  @ApiProperty({ description: 'Descripción', example: 'Recompensa 1' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @Length(2, 500, { message: 'La descripción debe tener entre 2 y 500 caracteres' })
  descripcion: string;

  @ApiProperty({ description: 'Puntos', example: 100 })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  @IsNumber({ allowInfinity: false }, { message: 'Los puntos deben ser un número' })
  @Min(0, { message: 'Los puntos mínimos son 0' })
  @IsNotEmpty({ message: 'Los puntos son requeridos' })
  puntos: number;
  
  @ApiProperty({ description: 'Cantidad', example: 100 })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  @IsNumber({ allowInfinity: false }, { message: 'La cantidad debe ser un número' })
  @Min(0, { message: 'La cantidad mínima es 0' })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  cantidad: number;

  @ApiProperty({ description: 'Foto'})
  foto?: string;
}

export class CreateCanjeDto {
  @ApiProperty({ description: 'Recompensa id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString({ message: 'La recompensa es requerida' })
  @IsUUID(4, { message: 'La recompensa debe ser un UUID válido' })
  @IsNotEmpty({ message: 'La recompensa es requerida' })
  recompensaId: string;
  
  @ApiProperty({ description: 'Usuario id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString({ message: 'El usuario es requerido' })
  @IsUUID(4, { message: 'El usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El usuario es requerido' })
  usuarioId: string;
}

export class UpdateRecompensaDto extends PartialType(CreateRecompensaDto) {}