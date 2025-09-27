import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePuntosVerdeDto, UpdatePuntosVerdeDto } from './dto/create-puntos-verde.dto';
import { PrismaService } from '../prisma/prisma.service';
import CustomError from 'src/common/utils/custom.error';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PuntosVerdesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPuntosVerdeDto: CreatePuntosVerdeDto) {
    try {
      const { descripcion, imagen, ...puntosVerdeData } = createPuntosVerdeDto;
      const existPV = await this.prisma.puntoVerde.findFirst({
        where: {
          direccion: puntosVerdeData.direccion,
          isDeleted: false,
          nombre: puntosVerdeData.nombre,
        },
      });

      if (existPV) {
        throw new Error('El punto verde ya existe');
      }

      const puntosVerde = await this.prisma.puntoVerde.create({
        data: {
          ...puntosVerdeData,
          descripcion: descripcion,
          imagen: imagen,
        },
      });
      if (puntosVerde && puntosVerde.imagen) {
        puntosVerde.imagen = `${process.env.URL_BACKEND}${puntosVerde.imagen}`;
      }
      return puntosVerde;
    } catch (error) {
      if (createPuntosVerdeDto.imagen) {
        const fileName = createPuntosVerdeDto.imagen.split('/').pop();
        if (fileName) {
          const path = join(
            process.cwd(),
            'img',
            'puntos-verdes',
            fileName,
          );
          if (existsSync(path)) {
            unlinkSync(path);
          }
        }
      }
      throw new CustomError(error.message || 'Error al crear el punto verde', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const puntosVerdes = await this.prisma.puntoVerde.findMany({
        where: {
          isDeleted: false,
        },
      });
      puntosVerdes.map((puntoVerde) => {
        if (puntoVerde.imagen) {
          puntoVerde.imagen = `${process.env.URL_BACKEND}${puntoVerde.imagen}`;
        }
      });
      return puntosVerdes;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al obtener los puntos verdes',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      const puntoVerde = await this.prisma.puntoVerde.findUnique({
        where: {
          id,
          isDeleted: false,
        },
      });
      if (!puntoVerde) {
        throw new Error('El punto verde no existe');
      }
      if (puntoVerde && puntoVerde.imagen) {
        puntoVerde.imagen = `${process.env.URL_BACKEND}${puntoVerde.imagen}`;
      }
      return puntoVerde;
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener el punto verde', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, colaboradorId: string, updatePuntosVerdeDto: UpdatePuntosVerdeDto) {
    try {
      if (!id || !colaboradorId) {
        throw new Error('El id y el colaboradorId son requeridos');
      }
      const colaborador = await this.prisma.colaborador.findUnique({
        where: {
          id: colaboradorId,
          isDeleted: false,
        },
      });
      if (!colaborador) {
        throw new Error('El colaborador no existe');
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
        throw new Error('El punto verde no existe o no pertenece al colaborador');
      }
      if (puntoVerde && puntoVerde.imagen) {
        puntoVerde.imagen = `${process.env.URL_BACKEND}${puntoVerde.imagen}`;
      }
      return puntoVerde;
    } catch (error) {
      if (updatePuntosVerdeDto.imagen) {
        const fileName = updatePuntosVerdeDto.imagen.split('/').pop();
        if (fileName) {
          const path = join(
            process.cwd(),
            'img',
            'puntos-verdes',
            fileName,
          );
          if (existsSync(path)) {
            unlinkSync(path);
          }
        }
      }
      throw new CustomError(
        error.message || 'Error al actualizar el punto verde',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string, colaboradorId: string) {
    try {
      if (!id || !colaboradorId) {
        throw new Error('El id y el colaboradorId son requeridos');
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
        throw new Error('El punto verde no existe o no pertenece al colaborador');
      }
      return { message: 'Punto verde eliminado correctamente' };
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al eliminar el punto verde',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
