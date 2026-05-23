import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstadisticasService {
  constructor(private readonly prisma: PrismaService) {}
  async getUsuariosConMasPuntos() {
    const usuarios = await this.prisma.usuario.findMany({
      where: { isDeleted: false },
      select: {
        nombre: true,
        apellido: true,
        id: true,
        puntos: true,
      },
      orderBy: { puntos: 'desc' },
      take: 10,
    });
    const usuariosConPuntos = usuarios.map((usuario) => ({
      nombre: `${usuario.nombre} ${usuario.apellido}`,
      valor: usuario.puntos,
    }));
    return usuariosConPuntos;
  }

  async getUsuariosQueMasReciclaron() {
    const usuarios = await this.prisma.usuario.findMany({
      where: { isDeleted: false },
      select: {
        nombre: true,
        apellido: true,
        id: true,
        intercambio: {
          where: { isDeleted: false, estado: 'REALIZADO' },
          select: {
            detalleIntercambio: {
              where: { isDeleted: false },
              select: { pesoGramos: true },
            },
          },
        },
      },
    });

    const usuariosConPeso = usuarios
      .map((u) => ({
        nombre: `${u.nombre} ${u.apellido}`,
        valor: u.intercambio.reduce(
          (total, i) => total + i.detalleIntercambio.reduce((sub, d) => sub + d.pesoGramos, 0),
          0,
        ),
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10);

    return usuariosConPeso;
  }

  async getTuMaterialMasReciclado(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId, isDeleted: false },
      select: {
        nombre: true,
        apellido: true,
        id: true,
        intercambio: {
          where: { isDeleted: false, estado: 'REALIZADO' },
          select: {
            detalleIntercambio: {
              where: { isDeleted: false },
              select: {
                pesoGramos: true,
                residuo: {
                  select: { material: true },
                },
              },
            },
          },
        },
      },
    });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    const materiales: { [material: string]: number }[] = [];
    usuario.intercambio.forEach((intercambio) => {
      intercambio.detalleIntercambio.forEach((detalle) => {
        const material = detalle.residuo.material;
        const pesoGramos = detalle.pesoGramos;
        const materialExistente = materiales.find((m) => Object.keys(m)[0] === material);
        if (materialExistente) {
          materiales[material] += pesoGramos;
        } else {
          materiales.push({ [material]: pesoGramos });
        }
      });
    });

    const materialpuntos:{nombre:string, valor:number}[] =[] 
    materiales.forEach((m) => {
      const material = Object.keys(m)[0];
      const valor = m[material];
      materialpuntos.push({ nombre: material, valor });
    });
    return materialpuntos.sort((a, b) => b.valor - a.valor);

  }
  async getUsuariosQueMasEventosParticiparon() {
    const usuarios = await this.prisma.usuario.findMany({
      where: { isDeleted: false },
      select: {
        nombre: true,
        apellido: true,
        id: true,
        intercambio: {
          where: { isDeleted: false, eventoId: { not: null }, estado: 'REALIZADO' },
          select: {
            evento: {
              select: { titulo: true },
            },
          },
        },
      },
    });
    const contadorEventos: { nombre: string; valor: number }[] = [];
    usuarios.forEach((usuario) => {
      const usuarioNombre = `${usuario.nombre} ${usuario.apellido}`;
      usuario.intercambio.forEach((intercambio) => {
        const eventoTitulo: string[] = [];
        if (!intercambio.evento) {
          return;
        }
        if (eventoTitulo.includes(intercambio.evento.titulo)) {
          // Evento ya contado
        } else {
          eventoTitulo.push(intercambio.evento.titulo);
        }
      });
      contadorEventos.push({ nombre: usuarioNombre, valor: usuario.intercambio.length });
    });
    return contadorEventos.sort((a, b) => b.valor - a.valor).slice(0, 10);
  }
  //admin
  async getMaterialMasReciclado() {
    const intercambios = await this.prisma.intercambio.findMany({
      where: { isDeleted: false, estado: 'REALIZADO' },
      select: {
        detalleIntercambio: {
          where: { isDeleted: false },
          select: {
            pesoGramos: true,
            residuo: {
              select: { material: true },
            },
          },
        },
      },
    });
    const materiales: { [material: string]: number }[] = [];
    intercambios.forEach((intercambio) => {
      intercambio.detalleIntercambio.forEach((detalle) => {
        const material = detalle.residuo.material;
        const pesoGramos = detalle.pesoGramos;
        const materialExistente = materiales.find((m) => Object.keys(m)[0] === material);
        if (materialExistente) {
          materiales[material] += pesoGramos;
        } else {
          materiales.push({ [material]: pesoGramos });
        }
      });
    });

    const materialpuntos:{nombre:string, valor:number}[] =[] 
    materiales.forEach((m) => {
      const material = Object.keys(m)[0];
      const valor = m[material];
      materialpuntos.push({ nombre: material, valor });
    });
    return materialpuntos.sort((a, b) => b.valor - a.valor);

  }

  async getRecompensasMasCanjeadas() {
    //contar cuantas veces se canjeó cada recompensa
    const recompensas = await this.prisma.recompensa.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        titulo: true,
        _count: { select: { canjes: { where: { isDeleted: false } } } },
      },
      orderBy: { canjes: { _count: 'desc' } },
      take: 10,
    });
    const recompensasConValor = recompensas.map((r) => ({
      nombre: r.titulo,
      valor: r._count.canjes,
    }));
    return recompensasConValor;
  }

  async getPuntosVerdesMasUsados() {
    const puntosVerdes = await this.prisma.puntoVerde.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        nombre: true,
        _count: { select: { intercambio: { where: { isDeleted: false, estado: 'REALIZADO' } } } },
      },
      orderBy: { intercambio: { _count: 'desc' } },
      take: 10,
    });
    const puntosVerdesConValor = puntosVerdes.map((p) => ({
      nombre: p.nombre,
      valor: p._count.intercambio,
    }));
    return puntosVerdesConValor;
  }

  async getEventosMayorPartisipacion() {
    const eventos = await this.prisma.evento.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        titulo: true,
        _count: {
          select: { intercambio: { where: { isDeleted: false, estado: 'REALIZADO', eventoId: { not: null } } } },
        },
      },
      orderBy: { intercambio: { _count: 'desc' } },
      take: 10,
    });
    const eventosConValor = eventos.map((e) => ({
      nombre: e.titulo,
      valor: e._count.intercambio,
    }));
    return eventosConValor;
  }
  //async getAppConMasRegistros() {}
  //async getAppConUsuarios() {}
  //async getUsuariosQuePasaronElQuiz(){}
}
