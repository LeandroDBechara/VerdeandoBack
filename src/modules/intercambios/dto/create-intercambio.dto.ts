import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';

export class CreateIntercambioDto {

  @ApiProperty({ description: 'User id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty({ message: 'El usuario es requerido' })
  @IsUUID(4, { message: 'El usuario debe ser un UUID válido' })
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  usuarioId: string;

  @ApiProperty({ description: 'Coupon code', example: '123456' })
  @IsString({ message: 'El código del cupón debe ser una cadena de texto' })
  @IsOptional({ message: 'El código del cupón es opcional' })
  @Length(0, 6, { message: 'El código del cupón debe tener 6 caracteres' })
  codigoCupon?: string;

}

export class CreateDetalleIntercambioDto {
  @ApiProperty({ description: 'Residue id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty({ message: 'El residuo es requerido' })
  @IsUUID(4, { message: 'El residuo debe ser un UUID válido' })
  @IsString({ message: 'El residuo debe ser una cadena de texto' })
  residuoId: string;

  @ApiProperty({ description: 'Weight', example: 100 })
  @IsNotEmpty({ message: 'El peso es requerido' })
  @IsNumber({allowInfinity: false }, { message: 'El peso debe ser un número' })
  @Min(0, { message: 'El peso debe ser un número positivo' })
  pesoGramos: number;
}

export class ConfirmarIntercambioDto {
  @ApiProperty({ description: 'Token', example: '123456' })
  @IsNotEmpty({ message: 'El token es requerido' })
  @IsString({ message: 'El token debe ser una cadena de texto' })
  @IsJWT({ message: 'El token debe ser un token válido' })
  token: string;

  @ApiProperty({ description: 'Colaborator id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty({ message: 'El colaborador es requerido' })
  @IsUUID(4, { message: 'El colaborador debe ser un UUID válido' })
  @IsString({ message: 'El colaborador debe ser una cadena de texto' })
  colaboradorId: string;

  @ApiProperty({ description: 'Green point id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty({ message: 'El punto verde es requerido' })
  @IsUUID(4, { message: 'El punto verde debe ser un UUID válido' })
  @IsString({ message: 'El punto verde debe ser una cadena de texto' })
  puntoVerdeId: string;
}
export class UpdateIntercambioDto extends PartialType(CreateIntercambioDto) {}

