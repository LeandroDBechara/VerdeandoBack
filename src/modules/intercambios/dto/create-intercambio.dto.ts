import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIntercambioDto {

  @IsNotEmpty()
  @IsString()
  usuarioId: string;

  @IsNotEmpty()
  @IsString()
  codigoCupon?: string;

}

export class CreateDetalleIntercambioDto {
  @IsNotEmpty()
  @IsString()
  residuoId: string;

  @IsNotEmpty()
  @IsNumber()
  pesoGramos: number;
}

export class UpdateIntercambioDto extends PartialType(CreateIntercambioDto) {}

