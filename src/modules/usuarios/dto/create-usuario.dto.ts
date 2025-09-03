import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsDate, IsEmail, IsEnum, Length, MinLength, Matches, Validate, IsUrl, IsOptional, ValidateIf } from "class-validator";
import { ValidarCuit } from "src/utils/cuitValidation";
import { transformDateString } from "src/utils/date-transformer";


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
    
    @ApiProperty({ description: 'Fecha de nacimiento', example: '01-01-2000' })
    @Transform(({ value }) => transformDateString(value, 'La fecha de nacimiento'))
    @IsDate({message: 'La fecha de nacimiento debe ser una fecha válida'})
    @IsNotEmpty({message: 'La fecha de nacimiento es requerida'})
    fechaNacimiento:Date;
    
    @ApiProperty({ description: 'Email', example: 'juan@gmail.com' })
    @IsEmail({}, {message: 'El email debe ser una dirección de correo electrónico válida'})
    @IsNotEmpty({message: 'El email es requerido'})
    email:string;
    
    @ApiProperty({ description: 'Password', example: '123456' })
    @IsString({message: 'La contraseña debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'La contraseña es requerida'})
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    password:string;

    @ApiProperty({ description: 'Rol', example: 'ADMIN' })
    @IsEnum(Role, {message: 'El rol debe ser un rol válido'})
    @IsNotEmpty({message: 'El rol es requerido'})
    rol:Role;

}

export class CreateColaboradorDto {
    @ApiProperty({ description: 'Usuario', example: '123456' })
    @IsString({message: 'El usuario debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'El usuario es requerido'})
    usuarioId:string;

    @ApiProperty({ description: 'CVU', example: '1234567890123456789012' })
    @IsString({message: 'El CVU debe ser una cadena de caracteres'})
    @Matches(/^\d{22}$/, { message: 'El CVU debe contener exactamente 22 dígitos numéricos' })
    @Length(22, 22, { message: 'El CVU debe tener 22 caracteres' })
    @IsNotEmpty({message: 'El CVU es requerido'})
    cvu:string;

    @ApiProperty({ description: 'Domicilio fiscal', example: 'Siempre Viva 123, Tierra del Fuego, Argentina' })
    @IsString({message: 'El domicilio fiscal debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'El domicilio fiscal es requerido'})
    domicilioFiscal:string;

    @ApiProperty({ description: 'CUIT/CUIL', example: '20-30123456-7' })   
    @Transform(({ value }) => value.replace(/-/g, ''))
    @Matches(/^\d{11}$/, { message: 'El CUIL/CUIT debe tener 11 dígitos numéricos' })
    @IsString({message: 'El CUIT/CUIL debe ser una cadena de caracteres'})
    @IsNotEmpty({message: 'El CUIT/CUIL es requerido'})
    @Validate(ValidarCuit, { message: 'El CUIL/CUIT ingresado no es válido (falló el dígito verificador)' })
    cuitCuil:string;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @ApiProperty({ description: 'Nombre', example: 'Juan', required: false })
    @IsOptional()
    @ValidateIf((o) => o.nombre && o.nombre.trim() !== '')
    @IsString({message: 'El nombre debe ser una cadena de caracteres'})
    @Length(2, 40, { message: 'El nombre debe tener entre 2 y 40 caracteres' })
    nombre?:string;

    @ApiProperty({ description: 'Apellido', example: 'Perez', required: false })
    @IsOptional()
    @ValidateIf((o) => o.apellido && o.apellido.trim() !== '')
    @IsString({message: 'El apellido debe ser una cadena de caracteres'})
    @Length(2, 40, { message: 'El apellido debe tener entre 2 y 40 caracteres' })
    apellido?:string;
    
    @ApiProperty({ description: 'Fecha de nacimiento', example: '01-01-2000', required: false })
    @IsOptional()
    @ValidateIf((o) => o.fechaNacimiento && o.fechaNacimiento !== '')
    @Transform(({ value }) => {
      if (!value || value === '') return undefined;
      return transformDateString(value, 'La fecha de nacimiento');
    })
    @IsDate({message: 'La fecha de nacimiento debe ser una fecha válida'})
    fechaNacimiento?:Date;
    
    @ApiProperty({ description: 'Email', example: 'juan@gmail.com', required: false })
    @IsOptional()
    @ValidateIf((o) => o.email && o.email.trim() !== '')
    @IsEmail({}, {message: 'El email debe ser una dirección de correo electrónico válida'})
    email?:string;

    @ApiProperty({ description: 'Foto de perfil', example: 'https://example.com/image.jpg', required: false })
    @IsOptional()
    @ValidateIf((o) => o.fotoPerfil && o.fotoPerfil.trim() !== '')
    @IsString({message: 'La foto de perfil debe ser una cadena de caracteres'})
    @IsUrl({},{ message: 'La foto de perfil debe ser una URL válida' })
    fotoPerfil?:string;

    @ApiProperty({ description: 'Dirección', example: 'Calle 123', required: false })
    @IsOptional()
    @ValidateIf((o) => o.direccion && o.direccion.trim() !== '')
    @IsString({message: 'La dirección debe ser una cadena de caracteres'})
    direccion?:string;
}

export class UpdateColaboradorDto extends PartialType(CreateColaboradorDto) {
    @ApiProperty({ description: 'CVU', example: '1234567890123456789012' })
    @IsString({message: 'El CVU debe ser una cadena de caracteres'})
    @Matches(/^\d{22}$/, { message: 'El CVU debe contener exactamente 22 dígitos numéricos' })
    @Length(22, 22, { message: 'El CVU debe tener 22 caracteres' })
    cvu:string;

    @ApiProperty({ description: 'Domicilio fiscal', example: 'Siempre Viva 123, Tierra del Fuego, Argentina' })
    @IsString({message: 'El domicilio fiscal debe ser una cadena de caracteres'})
    domicilioFiscal:string;

    @ApiProperty({ description: 'CUIT/CUIL', example: '20-30123456-7' })   
    @Transform(({ value }) => value.replace(/-/g, ''))
    @Matches(/^\d{11}$/, { message: 'El CUIL/CUIT debe tener 11 dígitos numéricos' })
    @IsString({message: 'El CUIT/CUIL debe ser una cadena de caracteres'})
    cuitCuil:string;
}