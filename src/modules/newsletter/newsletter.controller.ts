import { Controller, Get } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener artículos de noticias sobre medio ambiente' })
  @ApiResponse({ 
    status: 200, 
    description: 'Retorna los 5 artículos más relevantes sobre medio ambiente y reciclaje' 
  })
  async getArticulos() {
    return await this.newsletterService.getArticulos();
  }
}

