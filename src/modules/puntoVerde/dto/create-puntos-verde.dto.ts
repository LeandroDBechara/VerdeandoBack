import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Max, Min, IsUrl, Length, IsUUID, IsArray, ValidateIf, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePuntosVerdeDto {
    @ApiProperty({ description: 'Latitud', example: 10.0 })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
          return parseFloat(value);
        }
        return value;
      })
    @IsNumber({allowInfinity: false }, { message: 'La latitud debe ser un número' })
    @Min(-90, { message: 'La latitud mínima es -90' })
    @Max(90, { message: 'La latitud máxima es 90' })
    @IsNotEmpty({ message: 'La latitud es requerida' })
    latitud: number;
    
    @ApiProperty({ description: 'Longitud', example: 10.0 })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
          return parseFloat(value);
        }
        return value;
      })
    @IsNumber({ allowInfinity: false }, { message: 'La longitud debe ser un número' })
    @Min(-180, { message: 'La longitud mínima es -180' })
    @Max(180, { message: 'La longitud máxima es 180' })
    @IsNotEmpty({ message: 'La longitud es requerida' })
    longitud: number;

    @ApiProperty({ description: 'Dirección', example: 'Calle 123' })
    @IsNotEmpty({ message: 'La dirección es requerida' })
    @IsString({ message: 'La dirección debe ser una cadena de texto' })
    @Length(3, 100, { message: 'La dirección debe tener entre 3 y 100 caracteres' })
    direccion: string;

    @ApiProperty({ description: 'Nombre', example: 'Punto Verde' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
    nombre: string;

    @ApiProperty({ description: 'Descripción', example: 'Punto Verde' })
    @IsOptional({ message: 'La descripción es requerida' })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @Length(2, 500, { message: 'La descripción debe tener entre 2 y 500 caracteres' })
    descripcion?: string;

    @ApiProperty({ description: 'Imagen' })
    @IsOptional({ message: 'La imagen es requerida' })
    @ValidateIf((o) => o.imagen && o.imagen.trim() !== '', { message: 'La imagen es requerida' })
    imagen?: string;

    @ApiProperty({ description: 'Días de atención', example: 'Lunes a Viernes 09:00 - 18:00 \n Sabado 09:00 - 13:00' })
    @IsNotEmpty({ message: 'Los días de atención son requeridos' })
    @IsString({ message: 'Los días de atención deben ser una cadena de texto' })
    @Length(3, 500, { message: 'Los días de atención deben tener entre 3 y 500 caracteres' })
    diasHorarioAtencion: string;

    @ApiProperty({ description: 'Colaborador id', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'El colaborador es requerido' })
    @IsUUID(4, { message: 'El colaborador debe ser un UUID válido' })
    @IsString({ message: 'El colaborador debe ser una cadena de texto' })
    colaboradorId: string;
    
    @ApiProperty({ description: 'Residuos aceptados', example: ['Plástico', 'Vidrio'] })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
          return value.split(',');
        }
        return value;
      })
    @IsOptional({ message: 'Los residuos aceptados son requeridos' })
    @IsString({ each: true, message: 'Los residuos aceptados deben ser cadenas de texto' })
    @IsArray({ message: 'Los residuos aceptados deben ser un arreglo' })
    residuosAceptados?: string[];
}
export class UpdatePuntosVerdeDto extends PartialType(CreatePuntosVerdeDto) {}