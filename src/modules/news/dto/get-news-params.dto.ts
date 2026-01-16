import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetNewsParamsDto {
  @ApiProperty({
    description: 'Categoría de las noticias',
    example: 'medtop:20000224',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({
    description: 'Idioma de las noticias (código ISO 639-1)',
    example: 'es',
    required: false,
  })
  @IsOptional()
  @IsString()
  lenguaje?: string;
}
