import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsString, IsNotEmpty, IsDate, IsEmail, IsEnum, Length, MinLength } from "class-validator";


export class CreateUsuarioDto {
    @ApiProperty({ description: 'Nombre', example: 'Juan' })
    @IsString( {message: 'El nombre debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'El nombre es requerido'})
    @Length(2, 40, { message: 'El nombre debe tener entre 2 y 40 caracteres' })
    nombre:string;

    @ApiProperty({ description: 'Apellido', example: 'Perez' })
    @IsString({message: 'El apellido debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'El apellido es requerido'})
    @Length(2, 40, { message: 'El apellido debe tener entre 2 y 40 caracteres' })
    apellido:string;
    
    @ApiProperty({ description: 'Fecha de nacimiento', example: '2000-01-01' })
    @IsDate({message: 'La fecha de nacimiento debe ser una fecha válida'})
    @IsNotEmpty({message: 'La fecha de nacimiento es requerida'})
    fechaNacimiento:Date;
    
    @ApiProperty({ description: 'Email', example: 'juan@gmail.com' })
    @IsEmail({}, {message: 'El email debe ser una dirección de correo electrónico válida'})
    @IsNotEmpty({message: 'El email es requerido'})
    email:string;
    
    @ApiProperty({ description: 'Contraseña', example: '123456' })
    @IsString({message: 'La contraseña debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'La contraseña es requerida'})
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    contraseña:string;

    @ApiProperty({ description: 'Rol', example: 'ADMIN' })
    @IsEnum(Role, {message: 'El rol debe ser un rol válido'})
    @IsNotEmpty({message: 'El rol es requerido'})
    rol:Role;

}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}