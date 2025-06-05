import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/create-usuario.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';

@ApiBearerAuth('access-token')
@ApiTags('Usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiCustomOperation({
    summary: 'Crear un usuario',
    bodyType: CreateUsuarioDto,
    responseStatus: 200,
    responseDescription: 'Usuario creado correctamente',
  })
  @Post('/register')
  @Roles(RoleEnum.ADMIN)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @ApiCustomOperation({
    summary: 'Obtener todos los usuarios',
    responseStatus: 200,
    responseDescription: 'Usuarios obtenidos correctamente',
  })
  @Get()
  @Roles(RoleEnum.ADMIN)
  findAll() {
    return this.usuariosService.findAll();
  }

  @ApiCustomOperation({
    summary: 'Obtener un usuario por id',
    responseStatus: 200,
    responseDescription: 'Usuario obtenido correctamente',
  })
  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @ApiCustomOperation({
    summary: 'Actualizar un usuario por id',
    bodyType: UpdateUsuarioDto,
    responseStatus: 200,
    responseDescription: 'Usuario actualizado correctamente',
  })
  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @ApiCustomOperation({
    summary: 'Eliminar un usuario por id',
    responseStatus: 200,
    responseDescription: 'Usuario eliminado correctamente',
  })
  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}
