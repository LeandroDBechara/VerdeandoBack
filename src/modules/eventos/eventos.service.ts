import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventoDto, UpdateEventoDto } from './dto/create-evento.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEventoDto: CreateEventoDto) {
    if (createEventoDto.puntosVerdesPermitidos) {
      const puntosVerdesPermitidos = await this.prisma.puntoVerde.findMany({
        where: { id: { in: createEventoDto.puntosVerdesPermitidos } },
        select: { id: true },
      });
      if (puntosVerdesPermitidos.length !== createEventoDto.puntosVerdesPermitidos.length) {
        throw new BadRequestException('Punto verde no encontrado');
      }
      createEventoDto.puntosVerdesPermitidos = puntosVerdesPermitidos.map((puntoVerde) => puntoVerde.id);
    }
    if(createEventoDto.fechaFin < createEventoDto.fechaInicio){
      throw new BadRequestException('La fecha de fin debe ser mayor a la fecha de inicio');
    }
    if(createEventoDto.fechaInicio < new Date() || createEventoDto.fechaFin < new Date()){
      throw new BadRequestException('La fecha de inicio y fin deben ser mayor a la fecha actual');
    }
    return this.prisma.evento.create({
      data: createEventoDto,
    });
  }

  async validarCodigo(codigo: string) {
    const evento = await this.prisma.evento.findFirst({
      where: { codigo },
    });
    if (!evento) {
      throw new BadRequestException('Código de evento no encontrado');
    }
    if(evento.fechaFin < new Date()){
      throw new BadRequestException('El evento ha finalizado');
    }
    if(evento.fechaInicio > new Date()){
      throw new BadRequestException('El evento no ha comenzado');
    }
    return evento;
  }

  async findAll() {
    return this.prisma.evento.findMany({
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
