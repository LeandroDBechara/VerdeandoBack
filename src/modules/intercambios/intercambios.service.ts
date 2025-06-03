import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleIntercambioDto, CreateIntercambioDto, UpdateIntercambioDto } from './dto/create-intercambio.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IntercambiosService {
  constructor(private readonly prisma: PrismaService) {}

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
      //QR

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
      return intercambio;
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    return `This action returns all intercambios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} intercambio`;
  }

  update(id: number, updateIntercambioDto: UpdateIntercambioDto) {
    return `This action updates a #${id} intercambio`;
  }

  remove(id: number) {
    return `This action removes a #${id} intercambio`;
  }
}
