import { Injectable } from '@nestjs/common';
import { CreateColaboradorDto, CreateUsuarioDto, UpdateUsuarioDto } from './dto/create-usuario.dto';
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
      throw new Error(error);
    }
  }
  async serColaborador(createColaboradorDto: CreateColaboradorDto) {
    const colaborador = await this.prisma.colaborador.create({
      data: {
        cvu: createColaboradorDto.cvu,
        domicilioFiscal: createColaboradorDto.domicilioFiscal,
        cuitCuil: createColaboradorDto.cuitCuil,
        usuarioId: createColaboradorDto.usuarioId,
      }
    });
    await this.prisma.usuario.update({
      where: { id: createColaboradorDto.usuarioId },
      data: {
        rol: Role.COLABORADOR,
      }
    });
    return colaborador;
  }


  async findAll() {
    try {
      const users = await this.prisma.usuario.findMany();
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.usuario.findUnique({ where: { id, isDeleted: false } });
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
      const user = await this.prisma.usuario.delete({ where: { id } });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
