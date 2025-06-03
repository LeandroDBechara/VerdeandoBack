import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsNotEmpty, IsDate, IsEmail } from "class-validator";


export class CreateUsuarioDto {
    @IsString( {message: 'El nombre debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'El nombre es requerido'})
    nombre:string;

    @IsString({message: 'El apellido debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'El apellido es requerido'})
    apellido:string;
    
    @IsDate({message: 'La fecha de nacimiento debe ser una fecha válida'})
    @IsNotEmpty({message: 'La fecha de nacimiento es requerida'})
    fechaNacimiento:Date;
    
    @IsEmail({}, {message: 'El email debe ser una dirección de correo electrónico válida'})
    @IsNotEmpty({message: 'El email es requerido'})
    email:string;
    
    @IsString({message: 'La contraseña debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'La contraseña es requerida'})
    contraseña:string;

    @IsString({message: 'El rol debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'El rol es requerido'})
    rol:string;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}