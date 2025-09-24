import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength, ValidateIf, Length } from 'class-validator';
import { transformDateString } from 'src/common/utils/date-transformer';

export class CreateEventoDto {
  @ApiProperty({ description: 'Título del evento', example: 'Evento de prueba' })
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El título debe tener entre 2 y 100 caracteres' })
  @MinLength(2, { message: 'El título debe tener entre 2 y 100 caracteres' })
  titulo: string;

  @ApiProperty({ description: 'Descripción del evento', example: 'Descripción del evento' })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La descripción debe tener entre 2 y 500 caracteres' })
  @MinLength(2, { message: 'La descripción debe tener entre 2 y 500 caracteres' })
  descripcion: string;

  @ApiProperty({ description: 'Imagen del evento'})
  @IsOptional()
  @ValidateIf((o) => o.imagen && o.imagen.trim() !== '', { message: 'La imagen es requerida' })
  imagen?: string ;

  @ApiProperty({ description: 'Fecha de inicio del evento', example: '01-01-2025' })
  @Transform(({ value }) => transformDateString(value, 'La fecha de inicio'))
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
  fechaInicio: Date;


  @ApiProperty({ description: 'Fecha de fin del evento', example: '01-01-2025' })
  @IsNotEmpty({ message: 'La fecha de fin es requerida' })
  @Transform(({ value }) => transformDateString(value, 'La fecha de fin'))
  @IsDate({ message: 'La fecha de fin debe ser una fecha válida' })
  fechaFin: Date;


  @ApiProperty({ description: 'Código del evento', example: '123456' })
  @IsOptional({ message: 'El código es requerido' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MaxLength(8, { message: 'El código debe tener entre 2 y 8 caracteres' })
  codigo?: string;

  @ApiProperty({ description: 'Multiplicador del evento', example: 1.2 })
  @IsOptional({ message: 'El multiplicador es requerido' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @IsNumber({}, { message: 'El multiplicador debe ser un número' })
  @Min(1.0, { message: 'El multiplicador debe ser mayor a 1.0' })
  multiplicador?: number;

  @ApiProperty({ description: 'Punto verde', example: ['123e4567-e89b-12d3-a456-426614174000'] })
  @IsOptional({ message: 'El punto verde es requerido' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  @IsArray({ message: 'El punto verde debe ser un array' })
  
  puntosVerdesPermitidos?: string[];
}

export class UpdateEventoDto extends PartialType(CreateEventoDto) {
  @ApiProperty({ description: 'Título del evento', example: 'Evento de prueba' })
  @IsOptional({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El título debe tener entre 2 y 100 caracteres' })
  @MinLength(2, { message: 'El título debe tener entre 2 y 100 caracteres' })
  titulo: string;

  @ApiProperty({ description: 'Descripción del evento', example: 'Descripción del evento' })
  @IsOptional({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La descripción debe tener entre 2 y 500 caracteres' })
  @MinLength(2, { message: 'La descripción debe tener entre 2 y 500 caracteres' })
  descripcion: string;

  @ApiProperty({ description: 'Imagen del evento'})
  @IsOptional({ message: 'La imagen es requerida' })
  @ValidateIf((o) => o.imagen && o.imagen.trim() !== '', { message: 'La imagen es requerida' })
  imagen?: string ;

  @ApiProperty({ description: 'Fecha de inicio del evento', example: '01-01-2025' })
  @IsOptional({ message: 'La fecha de inicio es requerida' })
  @Transform(({ value }) => transformDateString(value, 'La fecha de inicio'))
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida' })
  fechaInicio: Date;


  @ApiProperty({ description: 'Fecha de fin del evento', example: '01-01-2025' })
  @IsOptional({ message: 'La fecha de fin es requerida' })
  @Transform(({ value }) => transformDateString(value, 'La fecha de fin'))
  @IsDate({ message: 'La fecha de fin debe ser una fecha válida' })
  fechaFin: Date;


  @ApiProperty({ description: 'Código del evento', example: '123456' })
  @IsOptional({ message: 'El código es requerido' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @Length(2, 8, { message: 'El código debe tener entre 2 y 8 caracteres' })
  codigo?: string;

  @ApiProperty({ description: 'Multiplicador del evento', example: 1.2 })
  @IsOptional({ message: 'El multiplicador es requerido' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @IsOptional({ message: 'El multiplicador es requerido' })
  @IsNumber({}, { message: 'El multiplicador debe ser un número' })
  @Min(1.0, { message: 'El multiplicador debe ser mayor a 1.0' })
  multiplicador?: number;

  @ApiProperty({ description: 'Punto verde', example: ['123e4567-e89b-12d3-a456-426614174000'] })
  @IsOptional({ message: 'El punto verde es requerido' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  @IsArray({ message: 'El punto verde debe ser un array' })
  @IsOptional({ message: 'El punto verde es requerido' })
  puntosVerdesPermitidos?: string[];
}