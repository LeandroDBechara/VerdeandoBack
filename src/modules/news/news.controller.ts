import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { GetNewsParamsDto } from './dto/get-news-params.dto'; 
import { Newsletter } from '@prisma/client';
import { CreateNewsletterDto } from '../newsletter/dto/create-newsletter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AddNewsToFavoriteDto, RemoveFromFavoriteDto } from './dto/add-news-to-favorite.dto';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get news' })
  @ApiResponse({ status: 200, description: 'News retrieved successfully' })
  async getNews() {
    return await this.newsService.getNews();
  }
  @Post()
  @ApiOperation({ summary: 'Create news' })
  @ApiResponse({ status: 201, description: 'News created successfully' })
  async createNews(@Body() news: CreateNewsletterDto) {
    return await this.newsService.createNews(news);
  }
  @Post('add-to-favorite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @ApiBody({ type: AddNewsToFavoriteDto })
  @ApiOperation({ summary: 'Add news to favorite' })
  @ApiResponse({ status: 201, description: 'News added to favorite successfully' })
    async addNewToFavorite(@Body() addNewsToFavoriteDto: AddNewsToFavoriteDto) {
    const { userId, newsId, ...news } = addNewsToFavoriteDto;
    return await this.newsService.addNewToFavorite(userId, newsId, news);
  }
  @Post('remove-from-favorite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @ApiBody({ type: RemoveFromFavoriteDto })
  @ApiOperation({ summary: 'Remove news from favorite' })
  @ApiResponse({ status: 201, description: 'News removed from favorite successfully' })
  async removeFromFavorite(@Body() removeFromFavoriteDto: RemoveFromFavoriteDto) {
    const { userId, newsId } = removeFromFavoriteDto;
    return await this.newsService.removeNewFromFavorite(userId, newsId);
  }
  @Post('add-view')
  @ApiOperation({ summary: 'Add view to news' })
  @ApiResponse({ status: 201, description: 'View added to news successfully' })
  async addView(@Body() newsId: string) {
    return await this.newsService.addView(newsId);
  }
}