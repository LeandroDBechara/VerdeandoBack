import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCanjeDto, CreateRecompensaDto, UpdateRecompensaDto } from './dto/create-recompensa.dto';
import { PrismaService } from '../prisma/prisma.service';
import CustomError from 'src/common/utils/custom.error';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class RecompensasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRecompensaDto: CreateRecompensaDto) {
    try {
      const recompensa = await this.prisma.recompensa.create({
        data: createRecompensaDto,
      });
      if (recompensa && recompensa.foto) {
        recompensa.foto = `${process.env.URL_BACKEND}${recompensa.foto}`;
      }
      return recompensa;
    } catch (error) {
      if (createRecompensaDto.foto) {
        const fileName = createRecompensaDto.foto.split('/').pop();
        if (fileName) {
          const path = join(process.cwd(), 'img', 'recompensas', fileName);
          if (existsSync(path)) {
            unlinkSync(path);
          }
        }
      }
      throw new CustomError(error.message || 'Error al crear la recompensa', HttpStatus.BAD_REQUEST);
    }
  }

  async createCanje(createCanjeDto: CreateCanjeDto) {
    try {
      const { recompensaId, usuarioId } = createCanjeDto;
      const recompensa = await this.prisma.recompensa.findUnique({
        where: { id: recompensaId, isDeleted: false },
      });
      if (!recompensa) {
        throw new Error('Recompensa no encontrada');
      }
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: usuarioId, isDeleted: false },
      });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      if (usuario.puntos < recompensa.puntos) {
        throw new Error('El usuario no tiene suficientes puntos');
      }
      if (recompensa.cantidad === 0) {
        throw new Error('No hay suficientes recompensas disponibles');
      }
      const canje = await this.prisma.canje.create({
        data: { recompensaId, usuarioId },
      });
      if (!canje) {
        throw new Error('Error al crear el canje');
      }
      await this.prisma.recompensa.update({
        where: { id: recompensaId },
        data: { cantidad: { decrement: 1 } },
      });
      await this.prisma.usuario.update({
        where: { id: usuarioId },
        data: { puntos: { decrement: recompensa.puntos } },
      });
      return { message: 'Canje creado correctamente' };
    } catch (error) {
      throw new CustomError(error.message || 'Error al crear el canje', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const recompensas = await this.prisma.recompensa.findMany({
        where: { isDeleted: false, cantidad: { gt: 0 } },
      });
      recompensas.map((recompensa) => {
        if (recompensa.foto) {
          recompensa.foto = `${process.env.URL_BACKEND}${recompensa.foto}`;
        }
      });
      return recompensas;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al obtener las recompensas',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      const recompensa = await this.prisma.recompensa.findUnique({
        where: { id, isDeleted: false },
      });
      if (!recompensa) {
        throw new Error('Recompensa no encontrada');
      }
      if (recompensa && recompensa.foto) {
        recompensa.foto = `${process.env.URL_BACKEND}${recompensa.foto}`;
      }
      return recompensa;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al obtener las recompensas',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllCanjesOnUser(usuarioId: string) {
    try {
      if (!usuarioId) {
        throw new Error('El id del usuario es requerido');
      }
      return await this.prisma.canje.findMany({
        where: { usuarioId, isDeleted: false },
        include: {
          recompensa: true,
        },
      });
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener los canjes', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateRecompensaDto: UpdateRecompensaDto) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      const recompensa = await this.prisma.recompensa.findUnique({
        where: { id },
      });
      if (!recompensa) {
        throw new Error('Recompensa no encontrada');
      }
      const updatedRecompensa = await this.prisma.recompensa.update({
        where: { id },
        data: updateRecompensaDto,
      });
      if (updatedRecompensa && updatedRecompensa.foto) {
        updatedRecompensa.foto = `${process.env.URL_BACKEND}${updatedRecompensa.foto}`;
      }
      return updatedRecompensa;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al actualizar la recompensa',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      const recompensa = await this.prisma.recompensa.findUnique({
        where: { id },
      });
      if (!recompensa) {
        throw new Error('Recompensa no encontrada');
      }
      await this.prisma.recompensa.delete({
        where: { id },
      });
      return { message: 'Recompensa eliminada correctamente' };
    } catch (error) {
      throw new CustomError(error.message || 'Error al eliminar la recompensa', error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
