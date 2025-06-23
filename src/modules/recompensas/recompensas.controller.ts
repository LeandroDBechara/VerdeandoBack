import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RecompensasService } from './recompensas.service';
import { CreateCanjeDto, CreateRecompensaDto, UpdateRecompensaDto } from './dto/create-recompensa.dto';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Recompensas')
//@UseGuards(JwtAuthGuard, RolesGuard)
//@ApiBearerAuth('access-token')
@Controller('recompensas')
export class RecompensasController {
  constructor(private readonly recompensasService: RecompensasService) {}

  @ApiCustomOperation({
    summary: 'Crear una recompensa',
    bodyType: CreateRecompensaDto,
    responseStatus: 200,
    responseDescription: 'Recompensa creada correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Post()
  create(@Body() createRecompensaDto: CreateRecompensaDto) {
    return this.recompensasService.create(createRecompensaDto);
  }

  @ApiCustomOperation({
    summary: 'Crear un canje',
    bodyType: CreateCanjeDto,
    responseStatus: 200,
    responseDescription: 'Canje creado correctamente',
  })
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @Post('canje')
  createCanje(@Body() createCanjeDto: CreateCanjeDto) {
    return this.recompensasService.createCanje(createCanjeDto);
  }

  @ApiCustomOperation({
    summary: 'Obtener todas las recompensas',
    responseStatus: 200,
    responseDescription: 'Recompensas obtenidas correctamente',
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.COLABORADOR, RoleEnum.USUARIO)
  @Get()
  findAll() {
    return this.recompensasService.findAll();
  }

  @ApiCustomOperation({
    summary: 'Obtener una recompensa por id',
    responseStatus: 200,
    responseDescription: 'Recompensa obtenida correctamente',
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.COLABORADOR, RoleEnum.USUARIO)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recompensasService.findOne(id);
  }

  @ApiCustomOperation({
    summary: 'Actualizar una recompensa por id',
    bodyType: UpdateRecompensaDto,
    responseStatus: 200,
    responseDescription: 'Recompensa actualizada correctamente',
  })
  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateRecompensaDto: UpdateRecompensaDto) {
    return this.recompensasService.update(id, updateRecompensaDto);
  }

  @ApiCustomOperation({
    summary: 'Eliminar una recompensa por id',
    responseStatus: 200,
    responseDescription: 'Recompensa eliminada correctamente',
  })
  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.recompensasService.remove(id);
  }
}
