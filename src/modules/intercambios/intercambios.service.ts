import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {ConfirmarIntercambioDto, CreateIntercambioDto, UpdateIntercambioDto} from './dto/create-intercambio.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EventosService } from '../eventos/eventos.service';
import CustomError from 'src/common/utils/custom.error';

@Injectable()
export class IntercambiosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly eventosService: EventosService,
  ) {}

  async create(createIntercambioDto: CreateIntercambioDto) {
    try {
      let pesoTotal = 0;
      let puntosTotal = 0;
      const detalles: { residuoId: string; pesoGramos: number; puntosTotal: number }[] = [];
      // Calcular totales primero
      for (const detalle of createIntercambioDto.detalles) {
        const residuo = await this.prisma.residuo.findFirst({
          where: { id: detalle.residuoId },
        });

        if (residuo) {
          pesoTotal += residuo.puntosKg;
          puntosTotal += residuo.puntosKg * detalle.pesoGramos;
          detalles.push({
            residuoId: detalle.residuoId,
            pesoGramos: detalle.pesoGramos,
            puntosTotal: detalle.pesoGramos * residuo.puntosKg,
          });
        }
      }
      // Validar si el codigo de cupon es valido
      let eventoId: string | null = null;
      if (createIntercambioDto.codigoCupon) {
        const evento = await this.eventosService.validarCodigo(createIntercambioDto.codigoCupon);
        if (evento) {
          puntosTotal = evento.multiplicador * puntosTotal;
          eventoId = evento.id;
        }
      }

      const intercambio = await this.prisma.intercambio.create({
        data: {
          usuarioId: createIntercambioDto.usuarioId,
          eventoId: eventoId ? eventoId : null,
          pesoTotal: pesoTotal,
          totalPuntos: puntosTotal,
          fecha: new Date(),
          fechaLimite: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          detalleIntercambio: {
            create: detalles.map((detalle) => ({
              residuoId: detalle.residuoId,
              pesoGramos: detalle.pesoGramos,
              puntosTotal: detalle.puntosTotal,
            })),
          },
        },
      });

      // Generar JWT con duración de una semana
      const token = await this.jwtService.signAsync({ intercambioId: intercambio.id }, { expiresIn: '7d' });

      // Actualizar el intercambio con el token
      const intercambioActualizado = await this.prisma.intercambio.update({
        where: { id: intercambio.id },
        data: { token },
        include: {
          usuario: { select: { id: true, nombre: true, apellido: true } },
          colaborador: { select: { id: true } },
          puntoVerde: { select: { id: true, nombre: true } },
          evento: { select: { id: true, titulo: true } },
          detalleIntercambio: {
            select: {
              id: true,
              residuo: { select: { id: true, material: true } },
              pesoGramos: true,
              puntosTotal: true,
            },
          },
        },
      });
      return intercambioActualizado;
    } catch (error) {
      throw new CustomError(error.message || 'Error al crear el intercambio', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async confirmarIntercambio(confirmarIntercambioDto: ConfirmarIntercambioDto) {
    try {
      const { token, colaboradorId, puntoVerdeId } = confirmarIntercambioDto;
      // Verificar el token JWT
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload) {
        throw new Error('El token no es valido o a expirado');
      }
      const intercambioId = payload.intercambioId;

      // Buscar el intercambio
      const intercambio = await this.prisma.intercambio.findUnique({
        where: {
          id: intercambioId,
          isDeleted: false,
        },
      });

      if (!intercambio) {
        throw new NotFoundException('Intercambio no encontrado o vencido');
      }

      if (intercambio?.estado === 'REALIZADO') {
        throw new Error('Este intercambio ya ha sido realizado');
      }

      if (intercambio?.estado === 'CANCELADO') {
        throw new Error('Este intercambio ha sido cancelado');
      }

      const puntoVerde = await this.prisma.puntoVerde.findUnique({
        where: { id: puntoVerdeId, isDeleted: false, colaboradorId: colaboradorId },
      });

      if (!puntoVerde) {
        throw new NotFoundException('Punto Verde no encontrado o no pertenece al colaborador');
      }

      if (intercambio.eventoId) {
        const evento = await this.prisma.evento.findUnique({
          where: { id: intercambio.eventoId, isDeleted: false },
        });
        if (!evento) {
          throw new NotFoundException('Evento no encontrado');
        }
        if (!evento.puntosVerdesPermitidos.includes(puntoVerdeId) && evento.puntosVerdesPermitidos.length > 1) {
          throw new NotFoundException('Punto Verde no permitido para este evento');
        }
        if (evento.fechaFin < new Date()) {
          throw new NotFoundException('El evento ha finalizado');
        }
        if (evento.fechaInicio > new Date()) {
          throw new NotFoundException('El evento no ha comenzado');
        }
      }

      const intercambioActualizado = await this.prisma.intercambio.update({
        where: { id: intercambioId },
        data: {
          fechaRealizado: new Date(),
          colaboradorId: colaboradorId,
          puntoVerdeId: puntoVerdeId,
          estado: 'REALIZADO',
        },
        include: {
          usuario: { select: { id: true, nombre: true, apellido: true } },
          colaborador: { select: { id: true } },
          puntoVerde: { select: { id: true, nombre: true } },
          evento: { select: { id: true, titulo: true } },
          detalleIntercambio: {
            select: {
              id: true,
              residuo: { select: { id: true, material: true } },
              pesoGramos: true,
              puntosTotal: true,
            },
          },
        },
      });

      if (intercambioActualizado) {
        const usuario = await this.prisma.usuario.findUnique({
          where: { id: intercambio?.usuarioId, isDeleted: false },
        });
        if (usuario) {
          usuario.puntos += intercambioActualizado.totalPuntos;
          await this.prisma.usuario.update({ where: { id: usuario.id }, data: { puntos: usuario.puntos } });
        }
      }

      return intercambioActualizado;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Verificar específicamente si el error es por token expirado
      if (error.name === 'TokenExpiredError') {
        throw new Error('El token ha expirado');
      }
      throw new CustomError(
        error.message || 'Error al confirmar el intercambio',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async cancelarIntercambio(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      await this.prisma.intercambio.update({
        where: { id, isDeleted: false },
        data: { estado: 'CANCELADO' },
      });
      const mensaje: string = 'intercambio cancelado correctamente';
      return mensaje;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al cancelar el intercambio',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllByUsuarioId(usuarioId: string) {
    try {
      if (!usuarioId) {
        throw new Error('El usuarioId es requerido');
      }

      const intercambios = await this.prisma.intercambio.findMany({
        where: { usuarioId, isDeleted: false },
      });

      if (intercambios.length === 0) {
        throw new Error('Este usuario no tiene intercambios');
      }

      for (const intercambio of intercambios) {
        if (intercambio.fechaLimite && intercambio.fechaLimite < new Date()) {
          await this.prisma.intercambio.update({
            where: { id: intercambio.id },
            data: { estado: 'EXPIRADO' },
          });
        }
      }
      const intercambiosActualizados = await this.prisma.intercambio.findMany({
        where: { usuarioId, isDeleted: false },
        include: {
          usuario: { select: { id: true, nombre: true, apellido: true } },
          colaborador: { select: { id: true } },
          puntoVerde: { select: { id: true, nombre: true } },
          evento: { select: { id: true, titulo: true } },
          detalleIntercambio: {
            select: {
              id: true,
              residuo: { select: { id: true, material: true } },
              pesoGramos: true,
              puntosTotal: true,
            },
          },
        },
      });
      if (intercambiosActualizados.length === 0) {
        throw new Error('Este usuario no tiene intercambios');
      }
      return intercambiosActualizados;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al obtener los intercambios',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const intercambios = await this.prisma.intercambio.findMany({
        where: { isDeleted: false },
      });
      if (intercambios.length === 0) {
        throw new Error('No se encontraron intercambios');
      }
      for (const intercambio of intercambios) {
        if (intercambio.fechaLimite && intercambio.fechaLimite < new Date()) {
          await this.prisma.intercambio.update({
            where: { id: intercambio.id },
            data: { estado: 'EXPIRADO' },
          });
        }
      }
      const intercambiosActualizados = await this.prisma.intercambio.findMany({
        where: { isDeleted: false },
        include: {
          usuario: { select: { id: true, nombre: true, apellido: true } },
          colaborador: { select: { id: true } },
          puntoVerde: { select: { id: true, nombre: true } },
          evento: { select: { id: true, titulo: true } },
          detalleIntercambio: {
            select: {
              id: true,
              residuo: { select: { id: true, material: true } },
              pesoGramos: true,
              puntosTotal: true,
            },
          },
        },
      });
      if (intercambiosActualizados.length === 0) {
        throw new Error('No se encontraron intercambios');
      }
      return intercambiosActualizados;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al obtener los intercambios',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      const intercambio = await this.prisma.intercambio.findUnique({
        where: { id, isDeleted: false },
        include: {
          usuario: { select: { id: true, nombre: true, apellido: true } },
          colaborador: { select: { id: true } },
          puntoVerde: { select: { id: true, nombre: true } },
          evento: { select: { id: true, titulo: true } },
          detalleIntercambio: {
            select: {
              id: true,
              residuo: { select: { id: true, material: true } },
              pesoGramos: true,
              puntosTotal: true,
            },
          },
        },
      });
      if (!intercambio) {
        throw new Error('Intercambio no encontrado');
      }
      return intercambio;
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener el intercambio', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateIntercambioDto: UpdateIntercambioDto) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      const intercambio = await this.prisma.intercambio.update({
        where: { id, isDeleted: false },
        data: updateIntercambioDto,
      });
      if (!intercambio) {
        throw new Error('Intercambio no encontrado');
      }
      return intercambio;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al actualizar el intercambio',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      const intercambio = await this.prisma.intercambio.update({
        where: { id, isDeleted: false },
        data: { isDeleted: true },
      });
      if (!intercambio) {
        throw new Error('Intercambio no encontrado');
      }
      return intercambio;
    } catch (error) {
      throw new CustomError(
        error.message || 'Error al eliminar el intercambio',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
