import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PuntosVerdesService } from './puntos-verdes.service';
import { CreatePuntosVerdeDto } from './dto/create-puntos-verde.dto';
import { UpdatePuntosVerdeDto } from './dto/update-puntos-verde.dto';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleEnum } from 'src/common/constants';
import { Roles } from '../../common/decorators/roles.decorators';


@UseGuards(JwtAuthGuard, RolesGuard) 
@ApiBearerAuth('access-token')
@ApiTags('Puntos Verdes')
@Controller('puntos-verdes')
export class PuntosVerdesController {
  constructor(private readonly puntosVerdesService: PuntosVerdesService) {}

  @Roles(RoleEnum.COLABORADOR)
  @ApiCustomOperation({
    summary: 'Create a new punto verde',
    bodyType: CreatePuntosVerdeDto,
    responseStatus: 200,
    responseDescription: 'Punto verde created successfully',
  })
  @Post()
  create(@Body() createPuntosVerdeDto: CreatePuntosVerdeDto) {
    return this.puntosVerdesService.create(createPuntosVerdeDto);
  }

  @ApiCustomOperation({
    summary: 'Get all puntos verdes',
    responseStatus: 200,
    responseDescription: 'Puntos verdes retrieved successfully',
  })
  @Get()
  findAll() {
    return this.puntosVerdesService.findAll();
  }

  @ApiCustomOperation({
    summary: 'Get a punto verde by id',
    responseStatus: 200,
    responseDescription: 'Punto verde retrieved successfully',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puntosVerdesService.findOne(id);
  }

  @ApiCustomOperation({
    summary: 'Update a punto verde by id',
    responseStatus: 200,
    responseDescription: 'Punto verde updated successfully',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePuntosVerdeDto: UpdatePuntosVerdeDto, @Param('colaboradorId') colaboradorId: string) {
    return this.puntosVerdesService.update(id, colaboradorId, updatePuntosVerdeDto);
  }

  @ApiCustomOperation({
    summary: 'Delete a punto verde by id',
    responseStatus: 200,
    responseDescription: 'Punto verde deleted successfully',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Param('colaboradorId') colaboradorId: string) {
    return this.puntosVerdesService.remove(id, colaboradorId);
  }
}
