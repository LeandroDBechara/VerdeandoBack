import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfirmarIntercambioDto, CreateDetalleIntercambioDto, CreateIntercambioDto, UpdateIntercambioDto } from './dto/create-intercambio.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IntercambiosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async create(createIntercambioDto: CreateIntercambioDto, createDetalleIntercambioDto: CreateDetalleIntercambioDto[]) {
    try {
      let pesoTotal = 0;
      let puntosTotal = 0;
      const detalles: { residuoId: string; pesoGramos: number; puntosTotal: number }[] = [];
      // Calcular totales primero
      for (const detalle of createDetalleIntercambioDto) {
        const residuo = await this.prisma.residuo.findUnique({
          where: { id: detalle.residuoId }
        });
        if (residuo) {
          pesoTotal += residuo.puntosKg;
          puntosTotal += residuo.puntosKg * detalle.pesoGramos;
          detalles.push({
            residuoId: detalle.residuoId,
            pesoGramos: detalle.pesoGramos,
            puntosTotal: detalle.pesoGramos * residuo.puntosKg
          });
        }
      }
      
      const evento = await this.prisma.evento.findFirst({
        where: { codigo: createIntercambioDto.codigoCupon }
      });
      if (evento) {
        puntosTotal = evento.multiplicador * puntosTotal;
      }

      const intercambio = await this.prisma.intercambio.create({
        data: {
          usuarioId: createIntercambioDto.usuarioId,
          eventoId: evento?.id,
          pesoTotal: pesoTotal,
          totalPuntos: puntosTotal,
          detalleIntercambio: {
            create: detalles
          }
        }
      });

      // Generar JWT con duración de una semana
      const token = await this.jwtService.signAsync(
        { intercambioId: intercambio.id },
        { expiresIn: '7d' }
      );

      // Actualizar el intercambio con el token
      const intercambioActualizado = await this.prisma.intercambio.update({
        where: { id: intercambio.id },
        data: { token }
      });
      const mensaje: string = "intercambio creado correctamente";
      return mensaje;
    } catch (error) {
      throw new Error(error);
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
        }
      });

      if (!intercambio) {
        throw new NotFoundException('Intercambio no encontrado o vencido');
      }

      if (intercambio?.estado === "REALIZADO") {
        throw new Error('Este intercambio ya ha sido realizado');
      }

      if (intercambio?.estado === "CANCELADO") {
        throw new Error('Este intercambio ha sido cancelado');
      }

      const puntoVerde = await this.prisma.puntoVerde.findUnique({
        where: { id: puntoVerdeId, isDeleted: false,colaboradorId: colaboradorId}
      });

      if (!puntoVerde) {
        throw new NotFoundException('Punto Verde no encontrado');
      }

      const intercambioActualizado = await this.prisma.intercambio.update({
        where: { id: intercambioId },
        data: { fechaRealizado: new Date(),
          colaboradorId: colaboradorId,
          puntoVerdeId: puntoVerdeId,
          estado: "REALIZADO"
          }
      });

      if(intercambioActualizado){
        const usuario = await this.prisma.usuario.findUnique({
          where: { id: intercambio?.usuarioId, isDeleted: false }
        });
        if(usuario){
          usuario.puntos += intercambioActualizado.totalPuntos;
          await this.prisma.usuario.update({ where: { id: usuario.id }, data: { puntos: usuario.puntos } });
        }
      }
      const mensaje: string = "intercambio realizado correctamente";

      return mensaje;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Verificar específicamente si el error es por token expirado
      if (error.name === 'TokenExpiredError') {
        throw new Error('El token ha expirado');
      }
      throw new Error('Token inválido');
    }
  }

  async cancelarIntercambio(id: string) {
   await this.prisma.intercambio.update({
      where: { id, isDeleted: false },
      data: { estado: "CANCELADO"}
    });
    const mensaje: string = "intercambio cancelado correctamente";
    return mensaje;
  }

  async findAllByUsuarioId(usuarioId: string) {
    return this.prisma.intercambio.findMany({
      where: { usuarioId, isDeleted: false }
    });
  }

  findAll() {
    return this.prisma.intercambio.findMany({
      where: { isDeleted: false }
    });
  }

  findOne(id: string) {
    return this.prisma.intercambio.findUnique({
      where: { id, isDeleted: false }
    });
  }

  update(id: string, updateIntercambioDto: UpdateIntercambioDto) {
    return this.prisma.intercambio.update({
      where: { id, isDeleted: false },
      data: updateIntercambioDto
    });
  }

  remove(id: string) {
    return this.prisma.intercambio.update({
      where: { id, isDeleted: false },
      data: { isDeleted: true }
    });
  }
}
