import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateEventoDto {
  @ApiProperty({ description: 'Título del evento', example: 'Evento de prueba' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es requerido' })
  titulo: string;

  @ApiProperty({ description: 'Descripción del evento', example: 'Descripción del evento' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  descripcion: string;

  @ApiProperty({ description: 'Imagen del evento', example: 'https://www.google.com/imagen.jpg' })
  @IsString({ message: 'La imagen debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La imagen es requerida' })
  @IsUrl({},{ message: 'La imagen debe ser una URL válida' })
  imagen?: string;

  @ApiProperty({ description: 'Fecha de inicio del evento', example: '2025-01-01' })
  @Transform(({ value }) => {
    if (!value) return value;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('La fecha de inicio debe ser una fecha válida');
    }
    return date;
  })
  @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
  fechaInicio: Date;

  @ApiProperty({ description: 'Fecha de fin del evento', example: '2025-01-01' })
  @Transform(({ value }) => {
    if (!value) return value;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('La fecha de fin debe ser una fecha válida');
    }
    return date;
  })
  @IsNotEmpty({ message: 'La fecha de fin es requerida' })
  fechaFin: Date;

  @ApiProperty({ description: 'Código del evento', example: '123456' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es requerido' })
  codigo: string;

  @ApiProperty({ description: 'Multiplicador del evento', example: 1.2 })
  @IsNumber({}, { message: 'El multiplicador debe ser un número' })
  @IsNotEmpty({ message: 'El multiplicador es requerido' })
  multiplicador: number;
  @ApiProperty({ description: 'Punto verde', example: ['123456'] })
  @IsArray({ message: 'El punto verde debe ser un array' })
  @IsOptional({ message: 'El punto verde es requerido' })
  puntosVerdesPermitidos?: string[];
}

export class UpdateEventoDto extends PartialType(CreateEventoDto) {}