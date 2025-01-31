import { PartialType } from "@nestjs/mapped-types";

export class CreateUsuarioDto {
    nombre:string;
    apellido:string;
    email:string;
    contraseña:string;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}