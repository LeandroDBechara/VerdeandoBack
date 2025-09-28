import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Min, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRecompensaDto {
  @ApiProperty({ description: 'Titulo', example: 'Recompensa 1' })
  @IsNotEmpty({ message: 'El titulo es requerido' })
  @IsString({ message: 'El titulo debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El titulo debe tener entre 2 y 100 caracteres' })
  @Transform(({ value }) => value.trim().slice(0, 1).toUpperCase() + value.trim().slice(1))
  titulo: string;

  @ApiProperty({ description: 'Descripción', example: 'Recompensa 1' })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @Length(2, 500, { message: 'La descripción debe tener entre 2 y 500 caracteres' })
  @Transform(({ value }) => value.trim().slice(0, 1).toUpperCase() + value.trim().slice(1))
  descripcion: string;

  @ApiProperty({ description: 'Puntos', example: 100 })
  @IsNotEmpty({ message: 'Los puntos son requeridos' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  @IsNumber({ allowInfinity: false }, { message: 'Los puntos deben ser un número' })
  @Min(0, { message: 'Los puntos mínimos son 0' })
  puntos: number;

  @ApiProperty({ description: 'Cantidad', example: 100 })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  @IsNumber({ allowInfinity: false }, { message: 'La cantidad debe ser un número' })
  @Min(0, { message: 'La cantidad mínima es 0' })
  cantidad: number;

  @ApiProperty({ description: 'Foto' })
  @IsOptional({ message: 'La foto es requerida' })
  @ValidateIf((o) => o.foto && o.foto.trim() !== '', { message: 'La imagen es requerida' })
  foto?: string;
}

export class CreateCanjeDto {
  @ApiProperty({ description: 'Recompensa id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty({ message: 'La recompensa es requerida' })
  @IsString({ message: 'La recompensa es requerida' })
  @IsUUID(4, { message: 'La recompensa debe ser un UUID válido' })
  recompensaId: string;

  @ApiProperty({ description: 'Usuario id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty({ message: 'El usuario es requerido' })
  @IsString({ message: 'El usuario es requerido' })
  @IsUUID(4, { message: 'El usuario debe ser un UUID válido' })
  usuarioId: string;
}

export class UpdateRecompensaDto extends PartialType(CreateRecompensaDto) {
  @ApiProperty({ description: 'Titulo', example: 'Recompensa 1' })
  @IsOptional({ message: 'El titulo es requerido' })
  @Transform(({ value }) => {
    if (!value || value === '') { return undefined; }
    return value;
  })
  @IsString({ message: 'El titulo debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El titulo debe tener entre 2 y 100 caracteres' })
  @Transform(({ value }) => value.trim().slice(0, 1).toUpperCase() + value.trim().slice(1))
  titulo: string;

  @ApiProperty({ description: 'Descripción', example: 'Recompensa 1' })
  @IsOptional({ message: 'La descripción es requerida' })
  @Transform(({ value }) => {
    if (!value || value === '') { return undefined; }
    return value;
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @Length(2, 500, { message: 'La descripción debe tener entre 2 y 500 caracteres' })
  @Transform(({ value }) => value.trim().slice(0, 1).toUpperCase() + value.trim().slice(1))
  descripcion: string;

  @ApiProperty({ description: 'Puntos', example: 100 })
  @IsOptional({ message: 'Los puntos son requeridos' })
  @Transform(({ value }) => {
    if (!value || value === '') { return undefined; }
    return value;
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  @IsNumber({ allowInfinity: false }, { message: 'Los puntos deben ser un número' })
  @Min(0, { message: 'Los puntos mínimos son 0' })
  puntos: number;

  @ApiProperty({ description: 'Cantidad', example: 100 })
  @IsOptional({ message: 'La cantidad es requerida' })
  @Transform(({ value }) => {
    if (!value || value === '') { return undefined; }
    return value;
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  @IsNumber({ allowInfinity: false }, { message: 'La cantidad debe ser un número' })
  @Min(0, { message: 'La cantidad mínima es 0' })
  cantidad: number;

  @ApiProperty({ description: 'Foto' })
  @IsOptional({ message: 'La foto es requerida' })
  @Transform(({ value }) => {
    if (!value || value === '') { return undefined; }
    return value;
  })
  @ValidateIf((o) => o.foto && o.foto.trim() !== '', { message: 'La imagen es requerida' })
  foto?: string;
}
