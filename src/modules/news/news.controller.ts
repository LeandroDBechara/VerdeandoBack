import { Controller, Get, Post, Body } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetNewsParamsDto } from './dto/get-news-params.dto'; 
import { Newsletter } from '@prisma/client';
import { CreateNewsletterDto } from '../newsletter/dto/create-newsletter.dto';

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
  @ApiOperation({ summary: 'Add news to favorite' })
  @ApiResponse({ status: 201, description: 'News added to favorite successfully' })
  async addNewToFavorite(@Body() userId: string, newsId: string, news: CreateNewsletterDto) {
    return await this.newsService.addNewToFavorite(userId, newsId, news);
  }
  @Post('remove-from-favorite')
  @ApiOperation({ summary: 'Remove news from favorite' })
  @ApiResponse({ status: 201, description: 'News removed from favorite successfully' })
  async removeFromFavorite(@Body()   userId: string, newsId: string ) {
    return await this.newsService.removeNewFromFavorite(userId, newsId);
  }
  @Post('add-view')
  @ApiOperation({ summary: 'Add view to news' })
  @ApiResponse({ status: 201, description: 'View added to news successfully' })
  async addView(@Body() newsId: string) {
    return await this.newsService.addView(newsId);
  }
}