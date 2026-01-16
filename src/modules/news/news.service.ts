import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNewsletterDto } from "../newsletter/dto/create-newsletter.dto";
import CustomError from "src/common/utils/custom.error";
import { Newsletter } from "@prisma/client";
@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}
  async createNews(news: CreateNewsletterDto) {
    try {
      const newNews = await this.prisma.newsletter.create({
        data: news,
      });
      return newNews;
    } catch (error) {
      throw new CustomError(error.message || 'Error al crear la noticia', HttpStatus.BAD_REQUEST);
    }
  }

  async getNews() { 
    try {
      const news = await this.prisma.newsletter.findMany();
      return news;
    } catch (error) {
      throw new CustomError(error.message || 'Error al obtener las noticias', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteNews(id: string) {
    try {
      const news = await this.prisma.newsletter.update({
      where: { id },
      data: { isDeleted: true },
    });
    if (!news) {
        throw new CustomError('Noticia no encontrada', HttpStatus.NOT_FOUND);
      }
      return { message: 'News deleted successfully' };
    } catch (error) {
      throw new CustomError(error.message || 'Error al eliminar la noticia', HttpStatus.BAD_REQUEST);
    }
  }

  async addNewToFavorite(userId: string, newsId: string, news: CreateNewsletterDto) {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new CustomError('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      let newsletter = await this.prisma.newsletter.findUnique({
        where: { id: newsId },
      });
      if (!newsletter) {
         newsletter = await this.createNews(news);
      }
      
      await this.prisma.usuario.update({
        where: { id: userId },
        data: { favNews: { connect: { id: newsletter.id } } },
      });
      return { message: 'News added to favorites successfully' };
    } catch (error) {
      throw new CustomError(error.message || 'Error al agregar la noticia a favoritos', HttpStatus.BAD_REQUEST);
    }
  }
  async removeNewFromFavorite(userId: string, newsId: string) {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new CustomError('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      await this.prisma.usuario.update({
        where: { id: userId },
        data: { favNews: { disconnect: { id: newsId } } },
      });
      return { message: 'News removed from favorites successfully' };
    }
    catch (error) {
      throw new CustomError(error.message || 'Error al eliminar la noticia de favoritos', HttpStatus.BAD_REQUEST);
    }
  }
  async addView(newsId: string) {
    try {
      await this.prisma.newsletter.update({
        where: { id: newsId },
        data: { views: { increment: 1 } },
      });
    }
    catch (error) {
      throw new CustomError(error.message || 'Error al agregar vista a la noticia', HttpStatus.BAD_REQUEST);
    }
  }
}