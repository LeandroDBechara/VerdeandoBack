import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {IsDate, IsDateString, IsEmail, IsNotEmpty, IsString, Length, MinLength} from 'class-validator';

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
  password: string;

  @ApiProperty({description: 'User birth date',example: '1996-04-27T00:00:00.000Z'})
  @Transform(({ value }) => {
    if (!value) return value;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('La fecha de nacimiento debe ser una fecha válida');
    }
    return date;
  })
  @IsDate({message: 'La fecha de nacimiento debe ser una fecha válida'})
  @IsNotEmpty({message: 'La fecha de nacimiento es requerida'})
  fechaDeNacimiento: Date;
  
}