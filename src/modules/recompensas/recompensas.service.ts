import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCanjeDto, CreateRecompensaDto, UpdateRecompensaDto } from './dto/create-recompensa.dto';
import { PrismaService } from '../prisma/prisma.service';
import CustomError from 'src/utils/custom.error';

@Injectable()
export class RecompensasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRecompensaDto: CreateRecompensaDto) {
    return this.prisma.recompensa.create({
      data: createRecompensaDto,
    });
  }

  async createCanje(createCanjeDto: CreateCanjeDto) {
    try {
      const { recompensaId, usuarioId } = createCanjeDto;
      const recompensa = await this.prisma.recompensa.findUnique({
        where: { id: recompensaId },
      });
      if (!recompensa) {
        throw new CustomError('Recompensa no encontrada', HttpStatus.BAD_REQUEST);
      }
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: usuarioId },
      });
      if (!usuario) {
        throw new CustomError('Usuario no encontrado', HttpStatus.BAD_REQUEST);
      }
      if (usuario.puntos < recompensa.puntos) {
        throw new CustomError('El usuario no tiene suficientes puntos', HttpStatus.BAD_REQUEST);
      }
      if (recompensa.cantidad === 0) {
        throw new CustomError('No hay suficientes recompensas disponibles', HttpStatus.BAD_REQUEST);
      }
        const canje = await this.prisma.canje.create({
          data: {recompensaId, usuarioId},
        });
        if (!canje) {
          throw new CustomError('Error al crear el canje', HttpStatus.BAD_REQUEST);
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
      throw new CustomError('Error al crear el canje', HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return this.prisma.recompensa.findMany({
      where: { isDeleted: false, cantidad: { gt: 0 } },
    });
  }

  findOne(id: string) {
    return this.prisma.recompensa.findUnique({
      where: { id },
    });
  }

  update(id: string, updateRecompensaDto: UpdateRecompensaDto) {
    return this.prisma.recompensa.update({
      where: { id },
      data: updateRecompensaDto,
    });
  }

  remove(id: string) {
    return this.prisma.recompensa.delete({
      where: { id },
    });
  }
}
