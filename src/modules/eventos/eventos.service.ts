import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventoDto, UpdateEventoDto } from './dto/create-evento.dto';
import { PrismaService } from '../prisma/prisma.service';
import CustomError from 'src/utils/custom.error';
import { existsSync } from 'fs';
import { join } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEventoDto: CreateEventoDto) {
    try {

    if(createEventoDto.fechaFin < createEventoDto.fechaInicio){
      throw new Error('La fecha de fin debe ser mayor a la fecha de inicio');
    }
    if(createEventoDto.fechaInicio < new Date() || createEventoDto.fechaFin < new Date()){
      throw new Error('La fecha de inicio y fin deben ser mayor a la fecha actual');
    }

    if (createEventoDto.puntosVerdesPermitidos && createEventoDto.puntosVerdesPermitidos.length > 0 && createEventoDto.puntosVerdesPermitidos[0] !== '') {
      const puntosVerdesPermitidos = await this.prisma.puntoVerde.findMany({
        where: { id: { in: createEventoDto.puntosVerdesPermitidos } },
        select: { id: true },
      });
      
      if (puntosVerdesPermitidos.length !== createEventoDto.puntosVerdesPermitidos.length) {
        throw new Error('Punto verde no encontrado');
      }
      createEventoDto.puntosVerdesPermitidos = puntosVerdesPermitidos.map((puntoVerde) => puntoVerde.id);
    }
   
    return this.prisma.evento.create({
      data: createEventoDto,
    });
    } catch (error) {
      if(createEventoDto.imagen){
        const path = join(process.cwd(), 'img', 'eventos', createEventoDto.imagen.split('/').pop() as string);
        if(existsSync(path)){
          unlinkSync(path);
        }
      }
      throw new CustomError('Error al crear el evento', HttpStatus.BAD_REQUEST);
    }
  }

  async validarCodigo(codigo: string) {
    const evento = await this.prisma.evento.findFirst({
      where: { codigo },
    });
    if (!evento) {
      throw new Error('Código de evento no encontrado');
    }
    if(evento.fechaFin < new Date()){
      throw new Error('El evento ha finalizado');
    }
    if(evento.fechaInicio > new Date()){
      throw new Error('El evento no ha comenzado');
    }
    return evento;
  }

  async findAll() {
    try {
    const eventos = await this.prisma.evento.findMany({
      where: {
        fechaFin: { gte: new Date() },
        isDeleted: false,
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        imagen: true,
        fechaInicio: true,
        fechaFin: true,
        codigo: true,
        puntosVerdesPermitidos: true,
      },
    });
    eventos.map((evento) => {
      const path = join(process.cwd(), 'img', 'eventos', evento.imagen?.split('/').pop() as string);
      if(existsSync(path)){
        evento.imagen = `${process.env.URL_BACKEND}${evento.imagen}`;
      }else{
        return "no existe";
      }
    });

    return eventos;
    } catch (error) {
      throw new CustomError('Error al obtener los eventos', HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: string) {
    return this.prisma.evento.findUnique({
      where: { id },
    });
  }

  update(id: string, updateEventoDto: UpdateEventoDto) {
    return this.prisma.evento.update({
      where: { id },
      data: updateEventoDto,
    });
  }

  remove(id: string) {
    return this.prisma.evento.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
