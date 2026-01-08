import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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