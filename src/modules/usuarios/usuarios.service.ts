import { HttpStatus, Injectable } from '@nestjs/common';
import {CargarJuegoDto, CreateColaboradorDto, CreateUsuarioDto, GuardarJuegoDto, UpdateColaboradorDto, UpdateUsuarioDto} from './dto/create-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import CustomError from 'src/common/utils/custom.error';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(newUser: CreateUsuarioDto) {
    try {
      const userExists = await this.prisma.usuario.findUnique({
        where: { email: newUser.email },
      });
      if (userExists) {
        throw new Error('El email ya está en uso');
      }
      if(newUser.fechaDeNacimiento > new Date()) {
        throw new Error('La fecha de nacimiento no puede ser mayor a la fecha actual');
      }
      const user = await this.prisma.usuario.create({
        data: {
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          fechaDeNacimiento: newUser.fechaDeNacimiento,
          email: newUser.email,
          password: newUser.password,
          rol: newUser.rol,
        },
        include: {
          comunidad: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              puntos: true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      throw new CustomError(error.message || 'Error al crear el usuario', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async serColaborador(createColaboradorDto: CreateColaboradorDto) {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: createColaboradorDto.usuarioId },
      });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      if (usuario.rol == Role.COLABORADOR) {
        throw new Error('El usuario ya es un colaborador');
      }
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
      if (!users) {
        throw new Error('Usuarios no encontrados');
      }
      users.map((user) => {
        if (user.fotoPerfil) {
          const fileName = user.fotoPerfil.split('/').pop();
          if (fileName) {
            const path = join(process.cwd(), 'img', 'usuarios', fileName);
            if (existsSync(path)) {
              user.fotoPerfil = `${process.env.URL_BACKEND}${user.fotoPerfil}`;
            }
          }
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
      if (user.fotoPerfil) {
        const fileName = user.fotoPerfil.split('/').pop();
        if (fileName) {
          const path = join(process.cwd(), 'img', 'usuarios', fileName);
          console.log(path);
          if (existsSync(path)) {
            user.fotoPerfil = `${process.env.URL_BACKEND}${user.fotoPerfil}`;
          }
        }
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
      const userExists = await this.prisma.usuario.findUnique({
        where: { id },
      });
      if (!userExists) {
        throw new Error('El usuario no existe');
      }

      const user = await this.prisma.usuario.update({
        where: { id },
        data: {
          ...updateUsuarioDto,
        },
      });

      //eliminar la foto de perfil anterior si existe
      if (updateUsuarioDto.fotoPerfil && userExists.fotoPerfil) {
        const fileName = userExists.fotoPerfil.split('/').pop();
        if (fileName) {
          const path = join(process.cwd(), 'img', 'usuarios', fileName);
          if (existsSync(path)) {
            unlinkSync(path);
          }
        }
      }

      if (user.fotoPerfil) {
        const fileName = user.fotoPerfil.split('/').pop();
        if (fileName) {
          const path = join(process.cwd(), 'img', 'usuarios', fileName);
          console.log(path);
          if (existsSync(path)) {
            user.fotoPerfil = `${process.env.URL_BACKEND}${user.fotoPerfil}`;
          }
        }
      }
      return user;
    } catch (error) {
      if (updateUsuarioDto.fotoPerfil) {
        const fileName = updateUsuarioDto.fotoPerfil.split('/').pop();
        if (fileName) {
          const path = join(process.cwd(), 'img', 'usuarios', fileName);
          if (existsSync(path)) {
            unlinkSync(path);
          }
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
      const userExists = await this.prisma.usuario.findUnique({ where: { id: id } });
      if (!userExists) {
        throw new Error('Usuario no encontrado');
      }
      await this.prisma.usuario.update({ where: { id: id }, data: { isDeleted: true } });
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
