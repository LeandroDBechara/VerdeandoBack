import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventoDto, UpdateEventoDto } from './dto/create-evento.dto';
import { PrismaService } from '../prisma/prisma.service';
import CustomError from 'src/utils/custom.error';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEventoDto: CreateEventoDto) {
    try {
      //titulo, descripcion, fechaInicio, fechaFin, imagen, codigo, multiplicador, puntosVerdesPermitidos
      if (createEventoDto.fechaFin < createEventoDto.fechaInicio) {
        throw new Error('La fecha de fin debe ser mayor a la fecha de inicio');
      }

      if (createEventoDto.fechaInicio < new Date() || createEventoDto.fechaFin < new Date()) {
        throw new Error('La fecha de inicio y fin deben ser mayor a la fecha actual');
      }

      if (
        createEventoDto.puntosVerdesPermitidos &&
        createEventoDto.puntosVerdesPermitidos.length > 0 &&
        createEventoDto.puntosVerdesPermitidos[0] !== ''
      ) {
        const puntosVerdesPermitidos = await this.prisma.puntoVerde.findMany({
          where: { id: { in: createEventoDto.puntosVerdesPermitidos }, isDeleted: false },
          select: { id: true },
        });

        if (puntosVerdesPermitidos.length === 0) {
          throw new Error('Puntos verdes no encontrados');
        }
        createEventoDto.puntosVerdesPermitidos = puntosVerdesPermitidos.map((puntoVerde) => puntoVerde.id);
      }

      return this.prisma.evento.create({
        data: {
          ...createEventoDto,
          codigo: createEventoDto.codigo ? createEventoDto.codigo : null,
          multiplicador: createEventoDto.multiplicador ? createEventoDto.multiplicador : 1.0,
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
    } catch (error) {
      if (createEventoDto.imagen) {
        const path = join(process.cwd(), 'img', 'eventos', createEventoDto.imagen.split('/').pop() as string);
        if (existsSync(path)) {
          unlinkSync(path);
        }
      }
      console.log(error);
      throw new CustomError(error.message || 'Error al crear el evento', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async validarCodigo(codigo: string) {
    try {
      if (!codigo) {
        throw new Error('El código es requerido');
      }
      if (codigo.length !== 8) {
        throw new Error('El código debe tener 8 caracteres');
      }
      if (codigo.length < 2) {
        throw new Error('El código debe tener entre 2 y 8 caracteres');
      }
      const evento = await this.prisma.evento.findFirst({
        where: { codigo },
      });
      if (!evento) {
        throw new Error('Código de evento no encontrado');
      }
      if (evento.fechaFin < new Date()) {
        throw new Error('El evento ha finalizado');
      }
      if (evento.fechaInicio > new Date()) {
        throw new Error('El evento no ha comenzado');
      }
      return evento;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al validar el código de evento',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
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
        if (existsSync(path)) {
          evento.imagen = `${process.env.URL_BACKEND}${evento.imagen}`;
        }
      });
      return eventos;
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener los eventos', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      return this.prisma.evento.findUnique({
        where: { id },
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
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener el evento', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateEventoDto: UpdateEventoDto) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      if (
        updateEventoDto.fechaFin &&
        updateEventoDto.fechaInicio &&
        updateEventoDto.fechaFin < updateEventoDto.fechaInicio
      ) {
        throw new Error('La fecha de fin debe ser mayor a la fecha de inicio');
      }
      if (updateEventoDto.fechaInicio && updateEventoDto.fechaInicio < new Date()) {
        throw new Error('La fecha de inicio y fin deben ser mayor a la fecha actual');
      }
      if (updateEventoDto.fechaFin && updateEventoDto.fechaFin < new Date()) {
        throw new Error('La fecha de fin debe ser mayor a la fecha actual');
      }
      if (
        updateEventoDto.puntosVerdesPermitidos &&
        updateEventoDto.puntosVerdesPermitidos.length > 0 &&
        updateEventoDto.puntosVerdesPermitidos[0] !== ''
      ) {
        const puntosVerdesPermitidos = await this.prisma.puntoVerde.findMany({
          where: { id: { in: updateEventoDto.puntosVerdesPermitidos }, isDeleted: false },
          select: { id: true },
        });
        updateEventoDto.puntosVerdesPermitidos = puntosVerdesPermitidos.map((puntoVerde) => puntoVerde.id);
      }
      return this.prisma.evento.update({
        where: { id },
        data: updateEventoDto,
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
    } catch (error) {
      throw new CustomError(error.message || 'Error al actualizar el evento', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      const evento = await this.prisma.evento.findUnique({
        where: { id },
      });
      if (!evento) {
        throw new Error('El evento no existe');
      }
      await this.prisma.evento.update({
        where: { id },
        data: { isDeleted: true },
      });
      return { message: 'Evento eliminado correctamente' };
    } catch (error) {
      throw new CustomError(error.message || 'Error al eliminar el evento', error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
