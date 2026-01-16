import { ApiProperty } from '@nestjs/swagger';

export class NewsResponseDto {
  @ApiProperty({ description: 'ID único de la noticia' })
  id: string;

  @ApiProperty({ description: 'Título de la noticia' })
  titulo: string;

  @ApiProperty({ description: 'Descripción de la noticia' })
  descripcion: string;

  @ApiProperty({ description: 'URL de la imagen de la noticia' })
  image: string;

  @ApiProperty({ description: 'URL de la noticia' })
  url: string;

  @ApiProperty({ description: 'Tag o categoría de la noticia' })
  tag: string;

  @ApiProperty({ description: 'Fecha de creación de la noticia' })
  fechaCreacion: Date;

  @ApiProperty({ description: 'Número de visualizaciones' })
  views: number;

  @ApiProperty({ description: 'Nivel de relevancia de la noticia' })
  relevancia: number;
}
