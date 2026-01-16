import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { UpperCaseTransformer } from "src/common/utils/UpperCaseTransformer";
import { Tag } from "@prisma/client";
export class CreateNewsletterDto {
    @ApiProperty({ description: 'Título de la newsletter', example: 'Newsletter de prueba' })
    @IsNotEmpty({ message: 'El título es requerido' })
    @IsString({ message: 'El título debe ser una cadena de texto' })
    @Length(2, 100, { message: 'El título debe tener entre 2 y 100 caracteres' })
    @Transform(UpperCaseTransformer)
    titulo: string;

    @ApiProperty({ description: 'Descripción de la newsletter', example: 'Descripción de la newsletter' })
    @IsNotEmpty({ message: 'La descripción es requerida' })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @Length(2, 500, { message: 'La descripción debe tener entre 2 y 500 caracteres' })
    @Transform(UpperCaseTransformer)
    descripcion: string;

    @ApiProperty({ description: 'Imagen de la newsletter', example: 'imagen.jpg' })
    @IsNotEmpty({ message: 'La imagen es requerida' })
    @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
    imagen: string;

    @ApiProperty({ description: 'URL de la newsletter', example: 'https://www.google.com' })
    @IsNotEmpty({ message: 'La URL es requerida' })
    @IsUrl({}, { message: 'La URL debe ser una URL válida' })
    @Transform(UpperCaseTransformer)
    url: string;

    @ApiProperty({ description: 'Tag de la newsletter', example: Tag.Noticias })
    @IsNotEmpty({ message: 'El tag es requerido' })
    @IsEnum(Tag, { message: 'El tag debe ser un tag válido' })
    tag: Tag;

    @ApiProperty({ description: 'Fecha de creación de la newsletter', example: '2025-01-01' })
    @IsOptional()
    @IsNotEmpty({ message: 'La fecha de creación es requerida' })
    @IsDate({ message: 'La fecha de creación debe ser una fecha válida' })
    fechaCreacion?: Date;
}
