import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PuntosVerdesService } from './puntos-verdes.service';
import { CreatePuntosVerdeDto, UpdatePuntosVerdeDto, ValidarPuntosVerdeDto } from './dto/create-puntos-verde.dto';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleEnum } from 'src/common/constants';
import { Roles } from '../../common/decorators/roles.decorators';

//@UseGuards(JwtAuthGuard, RolesGuard)
//@ApiBearerAuth('access-token')
@ApiTags('Puntos Verdes')
@Controller('puntos-verdes')
export class PuntosVerdesController {
  constructor(private readonly puntosVerdesService: PuntosVerdesService) {}

  @ApiCustomOperation({
    summary: 'Crear un nuevo punto verde',
    bodyType: CreatePuntosVerdeDto,
    responseStatus: 200,
    responseDescription: 'Punto verde creado correctamente',
  })
  @Roles(RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @Post()
  create(@Body() createPuntosVerdeDto: CreatePuntosVerdeDto) {
    return this.puntosVerdesService.create(createPuntosVerdeDto);
  }
  @ApiCustomOperation({
    summary: 'Verificar existencia de un punto verde por ubicación',
    responseStatus: 200,
    bodyType: ValidarPuntosVerdeDto,
    responseDescription: 'Punto verde obtenido correctamente',
  })
  @Roles(RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @Post('/verificar')
  verificarExistenciaPuntoVerde(@Body() location: ValidarPuntosVerdeDto) {
    return this.puntosVerdesService.verificarExistenciaPuntoVerde(location);
  }

  @ApiCustomOperation({
    summary: 'Obtener todos los puntos verdes',
    responseStatus: 200,
    responseDescription: 'Puntos verdes obtenidos correctamente',
  })
  @Roles(RoleEnum.COLABORADOR, RoleEnum.ADMIN, RoleEnum.USUARIO)
  @Get()
  findAll() {
    return this.puntosVerdesService.findAll();
  }

  @ApiCustomOperation({
    summary: 'Obtener un punto verde por id',
    responseStatus: 200,
    responseDescription: 'Punto verde obtenido correctamente',
  })
  @Roles(RoleEnum.COLABORADOR, RoleEnum.ADMIN, RoleEnum.USUARIO)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puntosVerdesService.findOne(id);
  }

  @ApiCustomOperation({
    summary: 'Actualizar un punto verde por id',
    bodyType: UpdatePuntosVerdeDto,
    responseStatus: 200,
    responseDescription: 'Punto verde actualizado correctamente',
  })
  @Roles(RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePuntosVerdeDto: UpdatePuntosVerdeDto,
    @Param('colaboradorId') colaboradorId: string,
  ) {
    return this.puntosVerdesService.update(id, colaboradorId, updatePuntosVerdeDto);
  }

  @ApiCustomOperation({
    summary: 'Eliminar un punto verde por id',
    responseStatus: 200,
    responseDescription: 'Punto verde eliminado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Param('colaboradorId') colaboradorId: string) {
    return this.puntosVerdesService.remove(id, colaboradorId);
  }
}
