import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateNewsletterDto } from '../../newsletter/dto/create-newsletter.dto';

export class AddNewsToFavoriteDto extends CreateNewsletterDto {
  @ApiProperty({ description: 'ID de la newsletter a marcar como favorita' })
  @IsString({ message: 'El id de la noticia debe ser una cadena' })
  @IsNotEmpty({ message: 'El id de la noticia es requerido' })
  newsId: string;

  @ApiProperty({ description: 'ID del usuario' })
  @IsUUID(4, { message: 'El id del usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El id del usuario es requerido' })
  userId: string;
}

export class RemoveFromFavoriteDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsUUID(4, { message: 'El id del usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El id del usuario es requerido' })
  userId: string;

  @ApiProperty({ description: 'ID de la newsletter' })
  @IsUUID(4, { message: 'El id de la newsletter debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El id de la newsletter es requerido' })
  newsId: string;
}