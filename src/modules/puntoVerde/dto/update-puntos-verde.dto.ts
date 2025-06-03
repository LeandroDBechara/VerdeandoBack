import { PartialType } from '@nestjs/mapped-types';
import { CreatePuntosVerdeDto } from './create-puntos-verde.dto';

export class UpdatePuntosVerdeDto extends PartialType(CreatePuntosVerdeDto) {}
