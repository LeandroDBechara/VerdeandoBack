import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResiduosService } from './residuos.service';
import { CreateResiduoDto, UpdateResiduoDto } from './dto/create-residuo.dto';


@Controller('residuos')
export class ResiduosController {
  constructor(private readonly residuosService: ResiduosService) {}

  @Post()
  create(@Body() createResiduoDto: CreateResiduoDto) {
    return this.residuosService.create(createResiduoDto);
  }

  @Get()
  findAll() {
    return this.residuosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residuosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResiduoDto: UpdateResiduoDto) {
    return this.residuosService.update(id, updateResiduoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residuosService.remove(id);
  }
}
