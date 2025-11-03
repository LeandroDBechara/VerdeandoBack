import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { RoleEnum } from 'src/common/constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}
  @ApiCustomOperation({ 
    summary: 'Crear una newsletter',
     bodyType: CreateNewsletterDto,})
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.ADMIN)
  create(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.create(createNewsletterDto);
  }

  @ApiCustomOperation({ summary: 'Obtener todas las newsletters', })
  @Get()
  findAll() {
    return this.newsletterService.findAll();
  }

  @ApiCustomOperation({ summary: 'Obtener una newsletter', })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsletterService.findOne(id);
  }

  @ApiCustomOperation({ summary: 'Actualizar una newsletter', bodyType: CreateNewsletterDto, })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateNewsletterDto: UpdateNewsletterDto) {
    return this.newsletterService.update(id, updateNewsletterDto);
  }

  @ApiCustomOperation({ summary: 'Eliminar una newsletter', })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(id);
  }
}
