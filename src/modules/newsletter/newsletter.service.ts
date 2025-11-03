import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { PrismaService } from '../prisma/prisma.service';
import CustomError from 'src/common/utils/custom.error';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createNewsletterDto: CreateNewsletterDto) {
    try {
      return this.prisma.newsletter.create({
        data: createNewsletterDto,
      });
    } catch (error) {
      throw new CustomError(error.message || 'Error al crear la newsletter', error.status || HttpStatus.BAD_REQUEST);
    }
  } 

  async findAll() {
    try {
      return this.prisma.newsletter.findMany({
        where: { isDeleted: false },
      });
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener las newsletters', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
        const newsletter = await this.prisma.newsletter.findUnique({
        where: { id, isDeleted: false },
      });
      if (!newsletter) {
        throw new Error('La newsletter no existe');
      }
      return newsletter;
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener la newsletter', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateNewsletterDto: UpdateNewsletterDto) {
    try {
      const newsletter = await this.prisma.newsletter.findUnique({
        where: { id, isDeleted: false },
      });
      if (!newsletter) {
        throw new Error('La newsletter no existe');
      }
      await this.prisma.newsletter.update({
        where: { id },
        data: updateNewsletterDto,
      });
      return { message: 'Newsletter actualizada correctamente' };
    } catch (error) {
      throw new CustomError(error.message || 'Error al actualizar la newsletter', error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const newsletter = await this.prisma.newsletter.findUnique({
        where: { id, isDeleted: false },
      });
      if (!newsletter) {
        throw new Error('La newsletter no existe');
      }
      await this.prisma.newsletter.update({
        where: { id },
        data: { isDeleted: true },
      });
      return { message: 'Newsletter eliminada correctamente' };
    } catch (error) {
      throw new CustomError(error.message || 'Error al eliminar la newsletter', error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
