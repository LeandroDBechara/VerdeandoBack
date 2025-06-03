import { Injectable } from '@nestjs/common';
import { CreateResiduoDto, UpdateResiduoDto } from './dto/create-residuo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResiduosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createResiduoDto: CreateResiduoDto) {
    return this.prisma.residuo.create({
      data: createResiduoDto
    });
  }

  findAll() {
    return this.prisma.residuo.findMany();
  }

  findOne(id: string) {
    return this.prisma.residuo.findUnique({
      where: { id }
    });
  }

  update(id: string, updateResiduoDto: UpdateResiduoDto) {
    return this.prisma.residuo.update({
      where: { id },
      data: updateResiduoDto
    });
  }

  remove(id: string) {
    return this.prisma.residuo.delete({
      where: { id }
    });
  }
}
