import { HttpStatus, Injectable } from '@nestjs/common';
import {CargarJuegoDto, CreateColaboradorDto, CreateUsuarioDto, GuardarJuegoDto, UpdateColaboradorDto, UpdateUsuarioDto} from './dto/create-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import CustomError from 'src/utils/custom.error';

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
      throw new CustomError(error.message || 'Error al crear el usuario', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async serColaborador(createColaboradorDto: CreateColaboradorDto) {
    try {
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
        },
      });
      //ver si enviar el colaborador o un mensaje
      return colaborador;
    } catch (error) {
      throw new CustomError(error.message || 'Error al crear el colaborador', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async updateColaborador(colaboradorId: string, updateColaboradorDto: UpdateColaboradorDto) {
    try {
      const existeColaborador = await this.prisma.colaborador.findUnique({
        where: { id: colaboradorId },
      });
      if (!existeColaborador) {
        throw new Error('Colaborador no encontrado');
      }

      const { cvu, domicilioFiscal, cuitCuil } = updateColaboradorDto;

      const colaborador = await this.prisma.colaborador.update({
        where: { id: colaboradorId },
        data: {
          cvu: cvu,
          domicilioFiscal: domicilioFiscal,
          cuitCuil: cuitCuil,
        },
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
      throw new CustomError(
        error.message || 'Error al actualizar el colaborador',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.usuario.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          colaborador: {
            select: {
              id: true,
              cvu: true,
              domicilioFiscal: true,
              cuitCuil: true,
              usuarioId: true,
            },
          },
        },
      });

      users.map((user) => {
        const path = join(process.cwd(), 'img', 'usuarios', user.fotoPerfil?.split('/').pop() as string);
        if (existsSync(path)) {
          user.fotoPerfil = `${process.env.URL_BACKEND}${user.fotoPerfil}`;
        }
      });

      return users;
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener los usuarios', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: { id, isDeleted: false },
        include: { colaborador: true },
      });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      const path = join(process.cwd(), 'img', 'usuarios', user.fotoPerfil?.split('/').pop() as string);
      console.log(path);
      if (existsSync(path)) {
        user.fotoPerfil = `${process.env.URL_BACKEND}${user.fotoPerfil}`;
      }
      return { user };
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener el usuario', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      // Mapear los campos del DTO a los nombres correctos de Prisma
      const updateData: any = {};

      if (updateUsuarioDto.nombre !== undefined && updateUsuarioDto.nombre.trim() !== '') {
        updateData.nombre = updateUsuarioDto.nombre;
      }
      if (updateUsuarioDto.apellido !== undefined && updateUsuarioDto.apellido.trim() !== '') {
        updateData.apellido = updateUsuarioDto.apellido;
      }
      if (
        updateUsuarioDto.fechaNacimiento !== undefined &&
        updateUsuarioDto.fechaNacimiento !== null &&
        (typeof updateUsuarioDto.fechaNacimiento === 'string' ? updateUsuarioDto.fechaNacimiento !== '' : true)
      ) {
        updateData.fechaDeNacimiento = updateUsuarioDto.fechaNacimiento;
      }
      if (updateUsuarioDto.email !== undefined && updateUsuarioDto.email.trim() !== '') {
        updateData.email = updateUsuarioDto.email;
      }
      if (updateUsuarioDto.direccion !== undefined && updateUsuarioDto.direccion.trim() !== '') {
        updateData.direccion = updateUsuarioDto.direccion;
      }
      if (updateUsuarioDto.fotoPerfil !== undefined) {
        updateData.fotoPerfil = updateUsuarioDto.fotoPerfil;
      }

      const user = await this.prisma.usuario.update({
        where: { id },
        data: updateData,
      });

      const path = join(process.cwd(), 'img', 'usuarios', user.fotoPerfil?.split('/').pop() as string);
      console.log(path);
      if (existsSync(path)) {
        user.fotoPerfil = `${process.env.URL_BACKEND}${user.fotoPerfil}`;
      }
      return user;
    } catch (error) {
      if (updateUsuarioDto.fotoPerfil) {
        const path = join(process.cwd(), 'img', 'usuarios', updateUsuarioDto.fotoPerfil.split('/').pop() as string);
        if (existsSync(path)) {
          unlinkSync(path);
        }
      }
      throw new CustomError(error.message || 'Error al actualizar el usuario', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new Error('El id es requerido');
      }
      const user = await this.prisma.usuario.update({ where: { id: id }, data: { isDeleted: true } });
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      throw new CustomError(error.message || 'Error al eliminar el usuario', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async guardarJuego(guardarJuegoDto: GuardarJuegoDto) {
    try {
      const { juego, nombre, datosDeGuardado, usuarioId } = guardarJuegoDto;
      if (!juego || !nombre || !datosDeGuardado || !usuarioId) {
        throw new Error('El juego, nombre, datosDeGuardado y usuarioId son requeridos');
      }
      const guardado = await this.prisma.guardado.create({
        data: { juego, nombre, datosDeGuardado, usuarioId },
      });
      return guardado;
    } catch (error) {
      throw new CustomError(error.message || 'Error al guardar el juego', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async cargarJuego(cargarJuegoDto: CargarJuegoDto) {
    try { 
      const { juego, usuarioId } = cargarJuegoDto;
      if (!juego || !usuarioId) {
        throw new Error('El id y el usuarioId son requeridos');
      }
      const guardado = await this.prisma.guardado.findFirst({ where: { juego, usuarioId } });
      if (!guardado) {
        throw new Error('Guardado no encontrado');
      }
      return { datosDeGuardado: guardado.datosDeGuardado, fechaActualizacion: guardado.fechaActualizacion };
    } catch (error) {
      throw new CustomError(error.message || 'Error al cargar el juego', error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
