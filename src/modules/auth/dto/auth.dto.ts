import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @ApiProperty({
    description: 'User email',
    example: 'joe@gmail.com',
  })
  @IsNotEmpty({message: 'El email es requerido'})
  @IsEmail({}, { message: 'El email no es valido'})
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User password',
    example: 'Pass1234',
  })
  @IsString({message: 'La contraseña debe ser un string'})
  @IsNotEmpty({message: 'La contraseña es requerida'})
  @MinLength(8,{message: 'La contraseña debe tener al menos 8 caracteres'})
  password: string;

  @ApiProperty({
    description: 'User password',
    example: 'Pass1234',
  })
  @IsString({message: 'La contraseña debe ser un string'})
  @IsNotEmpty({message: 'La contraseña es requerida'})
  @MinLength(8,{message: 'La contraseña debe tener al menos 8 caracteres'})
  confirmPassword: string;
}
