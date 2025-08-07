import { Injectable } from '@nestjs/common';
import { CreateColaboradorDto, CreateUsuarioDto, UpdateColaboradorDto, UpdateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';


@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(newUser: CreateUsuarioDto) {
    try {
      const user = await this.prisma.usuario.create({
        data: {
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          fechaDeNacimiento: newUser.fechaNacimiento,
          email: newUser.email,
          password: newUser.password,
          rol: newUser.rol,
        },
      });
      return user;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;}
  }

  async serColaborador(createColaboradorDto: CreateColaboradorDto) {
    const colaborador = await this.prisma.colaborador.create({
      data: {
        cvu: createColaboradorDto.cvu,
        domicilioFiscal: createColaboradorDto.domicilioFiscal,
        cuitCuil: createColaboradorDto.cuitCuil,
        usuarioId: createColaboradorDto.usuarioId,
      },
      select: {
        id: true,
        cvu: true,
        domicilioFiscal: true,
        cuitCuil: true,
        usuarioId: true,
      },
    });
    await this.prisma.usuario.update({
      where: { id: createColaboradorDto.usuarioId },
      data: {
        rol: Role.COLABORADOR,
      }
    });
    //ver si enviar el colaborador o un mensaje
    return colaborador;
  }

  async updateColaborador(colaboradorId:string, updateColaboradorDto: UpdateColaboradorDto) {
    try {
      const colaborador = await this.prisma.colaborador.update({
        where: { id: colaboradorId },
        data: updateColaboradorDto,
        select: {
          id: true,
          cvu: true,
          domicilioFiscal: true,
          cuitCuil: true,
          usuarioId: true,
        },
      });
      return colaborador;
    } catch (error) {
      throw  Error(error);
    }
  }


  async findAll() {
    try {
      const users = await this.prisma.usuario.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          colaborador: {select: {
            id: true,
            cvu: true,
            domicilioFiscal: true,
            cuitCuil: true,
            usuarioId: true,
          }},
        },
      });
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.usuario.findUnique({ where: { id, isDeleted: false }, include: { colaborador: true } });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const user = await this.prisma.usuario.update({ where: { id }, data: updateUsuarioDto as any });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.usuario.update({ where: { id:id }, data: { isDeleted: true } });
      return {message: 'Usuario eliminado correctamente'};
    } catch (error) {
      throw new Error(error);
    }
  }

  async guardarJuego(id: string, nombre: string, datosDeGuardado: Buffer, usuarioId: string) {
    const guardado = await this.prisma.guardado.create({
      data: { juegoId: id, nombre, datosDeGuardado, usuarioId },
    });
    return guardado;
  }

  async cargarJuego(id: string, usuarioId: string) {
    const guardado = await this.prisma.guardado.findUnique({ where: { juegoId: id, usuarioId } });
    if (!guardado) {
      throw new Error('Guardado no encontrado');
    }
    return {datosDeGuardado: guardado.datosDeGuardado, fechaActualizacion: guardado.fechaActualizacion};
  }
}
