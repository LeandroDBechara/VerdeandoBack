import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { loginDto } from './dto/login.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

    async create(newUser: CreateUsuarioDto) {
      try{
        const user = await this.prisma.usuario.create({ data: newUser });
        return user;
      }catch(error){
        throw new Error(error);
    }
  }

  login(user: loginDto){
    return user;
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return console.log(updateUsuarioDto);
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
