import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateResiduoDto, UpdateResiduoDto } from './dto/create-residuo.dto';
import { PrismaService } from '../prisma/prisma.service';
import CustomError from 'src/utils/custom.error';

@Injectable()
export class ResiduosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createResiduoDto: CreateResiduoDto) {
    try {
      const residuo = await this.prisma.residuo.findUnique({
        where: { material: createResiduoDto.material },
      });

      if (residuo) {
        throw new Error('El residuo ya existe');
      }

      return await this.prisma.residuo.create({
        data: createResiduoDto,
      });
    } catch (error) {
      throw new CustomError(error.message || 'Error al crear el residuo', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.prisma.residuo.findMany();
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener los residuos', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      return await this.prisma.residuo.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener el residuo', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateResiduoDto: UpdateResiduoDto) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      return await this.prisma.residuo.update({
        where: { id },
        data: updateResiduoDto,
      });
    } catch (error) {
      throw new CustomError(error.message || 'Error al actualizar el residuo', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      await this.prisma.residuo.delete({
        where: { id },
      });
      return { message: 'Residuo eliminado correctamente' };
    } catch (error) {
      throw new CustomError(error.message || 'Error al eliminar el residuo', error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
