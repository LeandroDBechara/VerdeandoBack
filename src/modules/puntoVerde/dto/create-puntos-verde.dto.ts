import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePuntosVerdeDto {
    @IsString()
    @IsNotEmpty()
    latitud: string;
    
    @IsString()
    @IsNotEmpty()
    longitud: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion?: string;

    @IsString()
    @IsNotEmpty()
    imagen?: string;

    @IsString()
    @IsNotEmpty()
    diasAtencion: string;

    @IsString()
    @IsNotEmpty()
    horario: string;

    @IsString()
    @IsNotEmpty()
    colaboradorId: string;
}
