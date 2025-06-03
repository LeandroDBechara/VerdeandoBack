import { ApiProperty } from '@nestjs/swagger';
import {IsDateString, IsEmail, IsNotEmpty, IsString, Length, MinLength} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({description: 'User name',example: 'joe'})
  @IsString({message: 'El nombre debe ser un string'})
  @IsNotEmpty({message: 'El nombre es requerido'})
  @Length(2, 40, {message: 'El nombre debe tener entre 2 y 40 caracteres'})
  nombre: string;

  @ApiProperty({description: 'User lastName',example: 'doe'})
  @IsString({message: 'El apellido debe ser un string'})
  @IsNotEmpty({message: 'El apellido es requerido'})
  @Length(2, 40, {message: 'El apellido debe tener entre 2 y 40 caracteres'})
  apellido: string;

  @ApiProperty({description: 'User email',example: 'joe@gmail.com'})
  @IsNotEmpty({message: 'El email es requerido'})
  @IsEmail({}, { message: 'El email no es valido'})
  email: string;

  @ApiProperty({description: 'User password',example: 'Pass1234'})
  @IsString({message: 'La contraseña debe ser un string'})
  @IsNotEmpty({message: 'La contraseña es requerida'})
  @MinLength(8,{message: 'La contraseña debe tener al menos 8 caracteres'})
  contraseña: string;

  @ApiProperty({description: 'User birth date',example: '2025-01-01'})
  @IsDateString({},{message: 'La fecha de nacimiento debe ser una fecha'})
  @IsNotEmpty({message: 'La fecha de nacimiento es requerida'})
  fechaDeNacimiento: Date;
  
}