import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Juego, Role } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsDate, IsEmail, IsEnum, Length, MinLength, Matches, Validate, IsUrl, IsOptional, ValidateIf, IsBase64} from "class-validator";
import { ValidarCuit } from "src/common/utils/cuitValidation";
import { transformDateString } from "src/common/utils/date-transformer";


export class CreateUsuarioDto {
    @ApiProperty({ description: 'Nombre', example: 'Juan' })
    @IsNotEmpty({message: 'El nombre es requerido'})
    @IsString( {message: 'El nombre debe ser una cadena de caracteres'})
    @Length(2, 40, { message: 'El nombre debe tener entre 2 y 40 caracteres' })
    @Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      if (trimmed.length === 0) return trimmed;
      return trimmed.slice(0, 1).toUpperCase() + trimmed.slice(1);
    })
    nombre:string;

    @ApiProperty({ description: 'Apellido', example: 'Perez' })
    @IsNotEmpty({message: 'El apellido es requerido'})
    @IsString({message: 'El apellido debe ser una cadena de caracteres'})
    @Length(2, 40, { message: 'El apellido debe tener entre 2 y 40 caracteres' })
    @Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      if (trimmed.length === 0) return trimmed;
      return trimmed.slice(0, 1).toUpperCase() + trimmed.slice(1);
    })
    apellido:string;
    
    @ApiProperty({ description: 'Fecha de nacimiento', example: '01-01-2000' })
    @IsNotEmpty({message: 'La fecha de nacimiento es requerida'})
    @Transform(({ value }) => transformDateString(value, 'La fecha de nacimiento'))
    @IsDate({message: 'La fecha de nacimiento debe ser una fecha válida'})
    fechaDeNacimiento:Date;
    
    @ApiProperty({ description: 'Email', example: 'juan@gmail.com' })
    @IsNotEmpty({message: 'El email es requerido'})
    @IsEmail({}, {message: 'El email debe ser una dirección de correo electrónico válida'})
    email:string;
    
    @ApiProperty({ description: 'Password', example: '123456' })
    @IsNotEmpty({message: 'La contraseña es requerida'})
    @IsString({message: 'La contraseña debe ser una cadena de caracteres'})
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'La contraseña debe contener al menos una letra mayúscula y un número' })
    password:string;

    @ApiProperty({ description: 'Rol', example: 'ADMIN' })
    @IsNotEmpty({message: 'El rol es requerido'})
    @IsEnum(Role, {message: 'El rol debe ser un rol válido'})
    rol:Role;

}

export class CreateColaboradorDto {
    @ApiProperty({ description: 'Usuario', example: '123456' })
    @IsNotEmpty({message: 'El usuario es requerido'})
    @IsString({message: 'El usuario debe ser una cadena de caracteres'})
    usuarioId:string;

    @ApiProperty({ description: 'CVU', example: '1234567890123456789012' })
    @IsNotEmpty({message: 'El CVU es requerido'})
    @IsString({message: 'El CVU debe ser una cadena de caracteres'})
    @Matches(/^\d{22}$/, { message: 'El CVU debe contener exactamente 22 dígitos numéricos' })
    @Length(22, 22, { message: 'El CVU debe tener 22 caracteres' })
    cvu:string;

    @ApiProperty({ description: 'Domicilio fiscal', example: 'Siempre Viva 123, Tierra del Fuego, Argentina' })
    @IsNotEmpty({message: 'El domicilio fiscal es requerido'})
    @IsString({message: 'El domicilio fiscal debe ser una cadena de caracteres'})
    domicilioFiscal:string;

    @ApiProperty({ description: 'CUIT/CUIL', example: '20-30123456-7' })   
    @Transform(({ value }) => value.replace(/-/g, ''))
    @Matches(/^\d{11}$/, { message: 'El CUIL/CUIT debe tener 11 dígitos numéricos' })
    @IsNotEmpty({message: 'El CUIT/CUIL es requerido'})
    @IsString({message: 'El CUIT/CUIL debe ser una cadena de caracteres'})
    @Validate(ValidarCuit, { message: 'El CUIL/CUIT ingresado no es válido (falló el dígito verificador)' })
    cuitCuil:string;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @ApiProperty({ description: 'Nombre', example: 'Juan', required: false })
    @IsOptional()
    @Transform(({ value }) => {
      if (!value || value === '') { return undefined; }
      return value;
    })
    @IsString({message: 'El nombre debe ser una cadena de caracteres'})
    @Length(2, 40, { message: 'El nombre debe tener entre 2 y 40 caracteres' })
    @Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      if (trimmed.length === 0) return trimmed;
      return trimmed.slice(0, 1).toUpperCase() + trimmed.slice(1);
    })
    nombre?:string;

    @ApiProperty({ description: 'Apellido', example: 'Perez', required: false })
    @IsOptional()
    @Transform(({ value }) => {
      if (!value || value === '') { return undefined; }
      return value;
    })
    @IsString({message: 'El apellido debe ser una cadena de caracteres'})
    @Length(2, 40, { message: 'El apellido debe tener entre 2 y 40 caracteres' })
    @Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      if (trimmed.length === 0) return trimmed;
      return trimmed.slice(0, 1).toUpperCase() + trimmed.slice(1);
    })
    apellido?:string;
    
    @ApiProperty({ description: 'Fecha de nacimiento', example: '01-01-2000', required: false })
    @IsOptional()
    @Transform(({ value }) => {
      if (!value || value === ''){ return undefined; }
      return transformDateString(value, 'La fecha de nacimiento',0,0,0,0);
    })
    @IsDate({message: 'La fecha de nacimiento debe ser una fecha válida'})
    fechaDeNacimiento?:Date;
    
    @ApiProperty({ description: 'Email', example: 'juan@gmail.com', required: false })
    @IsOptional()
    @Transform(({ value }) => {
      if (!value || value === '') { return undefined; }
      return value;
    })
    @IsEmail({}, {message: 'El email debe ser una dirección de correo electrónico válida'})
    email?:string;

    @ApiProperty({ description: 'Foto de perfil', example: 'https://example.com/image.jpg', required: false })
    @IsOptional()
    @Transform(({ value }) => {
      if (!value || value === '') { return undefined; }
      return value;
    })
    @IsString({message: 'La foto de perfil debe ser una cadena de caracteres'})
    @IsUrl({},{ message: 'La foto de perfil debe ser una URL válida' })
    fotoPerfil?:string;

    @ApiProperty({ description: 'Dirección', example: 'Calle 123', required: false })
    @IsOptional()
    @Transform(({ value }) => {
      if (!value || value === '') { return undefined; }
      return value;
    })
    @IsString({message: 'La dirección debe ser una cadena de caracteres'})
    direccion?:string;
}

export class UpdateColaboradorDto extends PartialType(CreateColaboradorDto) {
  @ApiProperty({ description: 'CVU', example: '1234567890123456789012' })
  @IsOptional()
  @IsNotEmpty({message: 'El CVU es requerido'})
  @IsString({message: 'El CVU debe ser una cadena de caracteres'})
  @Matches(/^\d{22}$/, { message: 'El CVU debe contener exactamente 22 dígitos numéricos' })
  @Length(22, 22, { message: 'El CVU debe tener 22 caracteres' })
  cvu:string;

  @ApiProperty({ description: 'Domicilio fiscal', example: 'Siempre Viva 123, Tierra del Fuego, Argentina' })
  @IsOptional()
  @IsNotEmpty({message: 'El domicilio fiscal es requerido'})
  @IsString({message: 'El domicilio fiscal debe ser una cadena de caracteres'})
  @Transform(({ value }) => value.trim().slice(0, 1).toUpperCase() + value.trim().slice(1))
  domicilioFiscal:string;

  @ApiProperty({ description: 'CUIT/CUIL', example: '20-30123456-7' })   
  @IsOptional()
  @Transform(({ value }) => value.replace(/-/g, ''))
  @Matches(/^\d{11}$/, { message: 'El CUIL/CUIT debe tener 11 dígitos numéricos' })
  @IsNotEmpty({message: 'El CUIT/CUIL es requerido'})
  @IsString({message: 'El CUIT/CUIL debe ser una cadena de caracteres'})
  @Validate(ValidarCuit, { message: 'El CUIL/CUIT ingresado no es válido (falló el dígito verificador)' })
  cuitCuil:string;
}

export class GuardarJuegoDto {
    @ApiProperty({ description: 'Juego', example: 'CLICKER' })
    @IsNotEmpty({message: 'El juego es requerido'})
    @IsEnum(Juego, {message: 'El juego debe ser un juego válido'})
    juego:Juego;

    @ApiProperty({ description: 'Nombre', example: 'Clicker' })
    @IsNotEmpty({message: 'El nombre es requerido'})
    @IsString({message: 'El nombre debe ser una cadena de caracteres'})
    nombre:string;

    @ApiProperty({ description: 'Datos de guardado', example: 'datosDeGuardado' })
    @IsNotEmpty({message: 'Los datos de guardado son requeridos'})
    @IsBase64({},{message: 'Los datos de guardado deben ser una cadena de caracteres base64'})
    datosDeGuardado:Buffer;

    @ApiProperty({ description: 'Usuario', example: '1' })
    @IsNotEmpty({message: 'El usuario es requerido'})
    @IsString({message: 'El usuario debe ser una cadena de caracteres'})
    usuarioId:string;
}

export class CargarJuegoDto {
    @ApiProperty({ description: 'Juego', example: 'CLICKER' })
    @IsNotEmpty({message: 'El juego es requerido'})
    @IsEnum(Juego, {message: 'El juego debe ser un juego válido'})
    juego:Juego;

    @ApiProperty({ description: 'Usuario', example: '1' })
    @IsNotEmpty({message: 'El usuario es requerido'})
    @IsString({message: 'El usuario debe ser una cadena de caracteres'})
    usuarioId:string;
}