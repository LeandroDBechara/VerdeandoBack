import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ResiduosService } from './residuos.service';
import { CreateResiduoDto, UpdateResiduoDto } from './dto/create-residuo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';

@ApiBearerAuth('access-token')
@ApiTags('Residuos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('residuos')
export class ResiduosController {
  constructor(private readonly residuosService: ResiduosService) {}

  @ApiCustomOperation({
    summary: 'Crear un residuo',
    bodyType: CreateResiduoDto,
    responseStatus: 200,
    responseDescription: 'Residuo creado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Post()
  create(@Body() createResiduoDto: CreateResiduoDto) {
    return this.residuosService.create(createResiduoDto);
  }

  @ApiCustomOperation({
    summary: 'Obtener todos los residuos',
    responseStatus: 200,
    responseDescription: 'Residuos obtenidos correctamente',
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.COLABORADOR, RoleEnum.USUARIO)
  @Get()
  findAll() {
    return this.residuosService.findAll();
  }

  @ApiCustomOperation({
    summary: 'Obtener un residuo por id',
    responseStatus: 200,
    responseDescription: 'Residuo obtenido correctamente',
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.COLABORADOR, RoleEnum.USUARIO)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residuosService.findOne(id);
  }

  @ApiCustomOperation({
    summary: 'Actualizar un residuo por id',
    bodyType: UpdateResiduoDto,
    responseStatus: 200,
    responseDescription: 'Residuo actualizado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResiduoDto: UpdateResiduoDto) {
    return this.residuosService.update(id, updateResiduoDto);
  }

  @ApiCustomOperation({
    summary: 'Eliminar un residuo por id',
    responseStatus: 200,
    responseDescription: 'Residuo eliminado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residuosService.remove(id);
  }
}
