import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetNewsParamsDto } from './dto/get-news-params.dto'; 

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
}