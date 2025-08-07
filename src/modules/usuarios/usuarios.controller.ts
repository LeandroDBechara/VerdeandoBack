import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateColaboradorDto, CreateUsuarioDto, UpdateColaboradorDto, UpdateUsuarioDto } from './dto/create-usuario.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';

//@UseGuards(JwtAuthGuard, RolesGuard)
//@ApiBearerAuth('access-token')
@ApiTags('Usuarios')
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
    summary: 'Crear un colaborador',
    bodyType: CreateColaboradorDto,
    responseStatus: 200,
    responseDescription: 'Colaborador creado correctamente',
  })
  @Post('/colaborador')
  @Roles(RoleEnum.USUARIO, RoleEnum.ADMIN)
  createColaborador(@Body() createColaboradorDto: CreateColaboradorDto) {
    return this.usuariosService.serColaborador(createColaboradorDto);
  }

  @ApiCustomOperation({
    summary: 'Actualizar un colaborador',
    bodyType: CreateColaboradorDto,
    responseStatus: 200,
    responseDescription: 'Colaborador actualizado correctamente',
  })

  @Patch('/colaborador/:id')
  @Roles(RoleEnum.USUARIO, RoleEnum.ADMIN)
  updateColaborador(@Param('id') id: string, @Body() updateColaboradorDto: UpdateColaboradorDto) {
    return this.usuariosService.updateColaborador(id, updateColaboradorDto);
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

  @ApiCustomOperation({
    summary: 'Guardar un juego',
    bodyType: {
      id: { type: 'string' },
      nombre: { type: 'string' },
      datosDeGuardado: { type: 'string' },
      usuarioId: { type: 'string' },
    },
    responseStatus: 200,
    responseDescription: 'Juego guardado correctamente',
  })
  @Post('/guardar-juego')
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  guardarJuego(@Body() guardarJuegoDto: {id: string, nombre: string, datosDeGuardado: Buffer, usuarioId: string}) {
    return this.usuariosService.guardarJuego(guardarJuegoDto.id, guardarJuegoDto.nombre, guardarJuegoDto.datosDeGuardado, guardarJuegoDto.usuarioId);
  }

  @ApiCustomOperation({
    summary: 'Cargar un juego',
    bodyType: {
      id: { type: 'string' },
      usuarioId: { type: 'string' },
    },
    responseStatus: 200,
    responseDescription: 'Juego cargado correctamente',
  })
  @Get('/cargar-juego')
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  cargarJuego(@Body() cargarJuegoDto: {id: string, usuarioId: string}) {
    return this.usuariosService.cargarJuego(cargarJuegoDto.id, cargarJuegoDto.usuarioId);
  }
}
