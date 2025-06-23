import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto, UpdateEventoDto } from './dto/create-evento.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Eventos')
@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @ApiCustomOperation({
    summary: 'Crear un evento',
    bodyType: CreateEventoDto,
    responseStatus: 200,
    responseDescription: 'Evento creado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Post()
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventosService.create(createEventoDto);
  }

  @ApiCustomOperation({
    summary: 'Obtener todos los eventos',
    responseStatus: 200,
    responseDescription: 'Eventos obtenidos correctamente',
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.USUARIO, RoleEnum.COLABORADOR)
  @Get()
  findAll() {
    return this.eventosService.findAll();
  }

  @ApiCustomOperation({
    summary: 'Obtener un evento por id',
    responseStatus: 200,
    responseDescription: 'Evento obtenido correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventosService.findOne(id);
  }


  @ApiCustomOperation({
    summary: 'Actualizar un evento',
    bodyType: UpdateEventoDto,
    responseStatus: 200,
    responseDescription: 'Evento actualizado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventosService.update(id, updateEventoDto);
  }

  @ApiCustomOperation({
    summary: 'Eliminar un evento',
    responseStatus: 200,
    responseDescription: 'Evento eliminado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventosService.remove(id);
  }
}
