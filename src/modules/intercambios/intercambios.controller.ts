import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { IntercambiosService } from './intercambios.service';
import {
  CreateDetalleIntercambioDto,
  CreateIntercambioDto,
  UpdateIntercambioDto,
  ConfirmarIntercambioDto,
} from './dto/create-intercambio.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Intercambios')
@Controller('intercambios')
export class IntercambiosController {
  constructor(private readonly intercambiosService: IntercambiosService) {}

  @ApiCustomOperation({
    summary: 'Crear un intercambio',
    bodyType: [CreateIntercambioDto, CreateDetalleIntercambioDto],
    responseStatus: 200,
    responseDescription: 'Intercambio creado correctamente',
  })
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @Post()
  async create(
    @Body() createIntercambioDto: CreateIntercambioDto,
    @Body() createDetalleIntercambioDto: CreateDetalleIntercambioDto[],
  ) {
    return this.intercambiosService.create(createIntercambioDto, createDetalleIntercambioDto);
  }

  @ApiCustomOperation({
    summary: 'Confirmar un intercambio',
    bodyType: ConfirmarIntercambioDto,
    responseStatus: 200,
    responseDescription: 'Intercambio confirmado correctamente',
  })
  @Roles(RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @Post('confirmar')
  async confirmarIntercambio(@Body() confirmarIntercambioDto: ConfirmarIntercambioDto) {
    return this.intercambiosService.confirmarIntercambio(confirmarIntercambioDto);
  }

  @ApiCustomOperation({
    summary: 'Obtener todos los intercambios',
    responseStatus: 200,
    responseDescription: 'Intercambios obtenidos correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Get()
  findAll() {
    return this.intercambiosService.findAll();
  }

  @ApiCustomOperation({
    summary: 'Obtener todos los intercambios por usuario',
    responseStatus: 200,
    responseDescription: 'Intercambios obtenidos correctamente',
  })
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @Get('usuario/:id')
  findAllByUsuarioId(@Param('id') id: string) {
    return this.intercambiosService.findAllByUsuarioId(id);
  }

  @ApiCustomOperation({
    summary: 'Obtener un intercambio por id',
    responseStatus: 200,
    responseDescription: 'Intercambio obtenido correctamente',
  })
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intercambiosService.findOne(id);
  }

  @ApiCustomOperation({
    summary: 'Actualizar un intercambio',
    responseStatus: 200,
    responseDescription: 'Intercambio actualizado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIntercambioDto: UpdateIntercambioDto) {
    return this.intercambiosService.update(id, updateIntercambioDto);
  }

  @ApiCustomOperation({
    summary: 'Eliminar un intercambio',
    responseStatus: 200,
    responseDescription: 'Intercambio eliminado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intercambiosService.remove(id);
  }
}
