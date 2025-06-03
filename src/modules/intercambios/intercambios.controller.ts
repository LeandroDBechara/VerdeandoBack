import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { IntercambiosService } from './intercambios.service';
import { CreateDetalleIntercambioDto, CreateIntercambioDto, UpdateIntercambioDto } from './dto/create-intercambio.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('intercambios')
export class IntercambiosController {
  constructor(private readonly intercambiosService: IntercambiosService) {}

  @Post()
  async create(@Body() createIntercambioDto: CreateIntercambioDto, @Body() createDetalleIntercambioDto: CreateDetalleIntercambioDto[]) {
    return this.intercambiosService.create(createIntercambioDto, createDetalleIntercambioDto  );
  }

  @Get()
  findAll() {
    return this.intercambiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intercambiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIntercambioDto: UpdateIntercambioDto) {
    return this.intercambiosService.update(+id, updateIntercambioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intercambiosService.remove(+id);
  }
}
