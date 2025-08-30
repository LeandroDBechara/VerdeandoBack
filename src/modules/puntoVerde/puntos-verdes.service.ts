import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePuntosVerdeDto, UpdatePuntosVerdeDto, ValidarPuntosVerdeDto } from './dto/create-puntos-verde.dto';
import { PrismaService } from '../prisma/prisma.service';
import CustomError from 'src/utils/custom.error';

@Injectable()
export class PuntosVerdesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPuntosVerdeDto: CreatePuntosVerdeDto) {
    try {
      const { descripcion, imagen, ...puntosVerdeData } = createPuntosVerdeDto;
      const existPV = await this.prisma.puntoVerde.findFirst({
        where: {
        direccion: puntosVerdeData.direccion,
      },
    });
    if (existPV) {
      throw new CustomError('El punto verde ya existe', HttpStatus.BAD_REQUEST);
    }
    
    const puntosVerde = await this.prisma.puntoVerde.create({
      data: {
        ...puntosVerdeData,
        descripcion: descripcion,
        imagen: imagen,
      },
    });
    return puntosVerde;
    } catch (error) {
      throw new CustomError(`Error al crear el punto verde ${error}`, HttpStatus.BAD_REQUEST);
    }
  }
  

  async findAll() {
    try {
      const puntosVerdes = await this.prisma.puntoVerde.findMany({
        where: {
          isDeleted: false,
          //revisar que no se muestre el colaborador el id ni los intercambios y eventos
      },
    });
    return puntosVerdes;
    } catch (error) {
      throw new CustomError('Error al obtener los puntos verdes', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new CustomError('El id es requerido', HttpStatus.BAD_REQUEST);
      }
      const puntoVerde = await this.prisma.puntoVerde.findUnique({
        where: {
          id,
          isDeleted: false,
        },
      });
      return puntoVerde;
    } catch (error) {
      throw new CustomError('Error al obtener el punto verde', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, colaboradorId: string, updatePuntosVerdeDto: UpdatePuntosVerdeDto) {
    try {
      if (!id || !colaboradorId) {
        throw new CustomError('El id y el colaboradorId son requeridos', HttpStatus.BAD_REQUEST);
      }
      const colaborador = await this.prisma.colaborador.findUnique({
        where: {
          id: colaboradorId,
          isDeleted: false,
        },
      });
      if (!colaborador) {
        throw new CustomError('El colaborador no existe', HttpStatus.BAD_REQUEST);
      }

      const { descripcion, imagen, ...puntosVerdeData } = updatePuntosVerdeDto;
      const puntoVerde = await this.prisma.puntoVerde.update({
        where: {
          id,
          isDeleted: false,
          colaboradorId: colaboradorId,
        },
        data: {
          ...puntosVerdeData,
          descripcion: descripcion,
          imagen: imagen,
        },
      });
      if (!puntoVerde) {
        throw new CustomError('El punto verde no existe o no pertenece al colaborador', HttpStatus.BAD_REQUEST);
      }
      return puntoVerde;
    } catch (error) {
  
      throw new CustomError(`Error al actualizar el punto verde ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string, colaboradorId: string) {
    try {
      if (!id || !colaboradorId) {
        throw new CustomError('El id y el colaboradorId son requeridos', HttpStatus.BAD_REQUEST);
      }

      const puntoVerde = await this.prisma.puntoVerde.update({
        where: {
          id,
          isDeleted: false,
          colaboradorId: colaboradorId,
        },
        data: {
          isDeleted: true,
        },
      });
      if (!puntoVerde) {
        throw new CustomError('El punto verde no existe o no pertenece al colaborador', HttpStatus.BAD_REQUEST);
      }
      return puntoVerde;
    } catch (error) {
      throw new CustomError('Error al eliminar el punto verde', HttpStatus.BAD_REQUEST);
    }
  }
}
