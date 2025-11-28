import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePuntosVerdeDto, UpdatePuntosVerdeDto } from './dto/create-puntos-verde.dto';
import { PrismaService } from '../prisma/prisma.service';
import CustomError from 'src/common/utils/custom.error';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PuntosVerdesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

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
      return puntosVerde;
    } catch (error) {
      if (createPuntosVerdeDto.imagen) {
        const filePath = this.supabaseService.extractFilePathFromUrl(createPuntosVerdeDto.imagen, 'puntos-verdes');
        if (filePath) {
          try {
            await this.supabaseService.deleteFile('puntos-verdes', filePath);
          } catch (deleteError) {
            console.error('Error al eliminar imagen en rollback:', deleteError);
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

      // Obtener el punto verde actual para eliminar la imagen anterior
      const puntoVerdeActual = await this.prisma.puntoVerde.findUnique({
        where: {
          id,
          isDeleted: false,
          colaboradorId: colaboradorId,
        },
      });

      if (!puntoVerdeActual) {
        throw new Error('El punto verde no existe o no pertenece al colaborador');
      }

      // Eliminar la imagen anterior si existe y es de Supabase
      if (updatePuntosVerdeDto.imagen && puntoVerdeActual.imagen) {
        const filePath = this.supabaseService.extractFilePathFromUrl(puntoVerdeActual.imagen, 'puntos-verdes');
        if (filePath) {
          try {
            await this.supabaseService.deleteFile('puntos-verdes', filePath);
          } catch (error) {
            console.error('Error al eliminar imagen anterior:', error);
          }
        }
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
      return puntoVerde;
    } catch (error) {
      // Si hay error y se subió una nueva imagen, intentar eliminarla
      if (updatePuntosVerdeDto.imagen) {
        const filePath = this.supabaseService.extractFilePathFromUrl(updatePuntosVerdeDto.imagen, 'puntos-verdes');
        if (filePath) {
          try {
            await this.supabaseService.deleteFile('puntos-verdes', filePath);
          } catch (deleteError) {
            console.error('Error al eliminar imagen en rollback:', deleteError);
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
