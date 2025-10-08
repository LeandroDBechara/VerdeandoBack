import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Headers} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import {
  CreateColaboradorDto,
  CreateUsuarioDto,
  CargarJuegoDto,
  GuardarJuegoDto,
  UpdateColaboradorDto,
  UpdateUsuarioDto,
} from './dto/create-usuario.dto';
import { ApiBearerAuth, ApiBody, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';


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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  createColaborador(@Body() createColaboradorDto: CreateColaboradorDto) {
    return this.usuariosService.serColaborador(createColaboradorDto);
  }

  @ApiCustomOperation({
    summary: 'Actualizar un colaborador',
    bodyType: UpdateColaboradorDto,
    responseStatus: 200,
    responseDescription: 'Colaborador actualizado correctamente',
  })
  @Patch('/colaborador/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.USUARIO, RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  updateColaborador(@Param('id') id: string, @Body() updateColaboradorDto: UpdateColaboradorDto) {
    return this.usuariosService.updateColaborador(id, updateColaboradorDto);
  }

  @ApiCustomOperation({
    summary: 'Obtener todos los usuarios',
    responseStatus: 200,
    responseDescription: 'Usuarios obtenidos correctamente',
  })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
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
  findOne(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    return this.usuariosService.findOne(id, authorization);
  }

  @ApiCustomOperation({
    summary: 'Actualizar un usuario por id',
    responseStatus: 200,
    responseDescription: 'Usuario actualizado correctamente',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fotoPerfil: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen para la foto de perfil',
        },
        nombre: {
          type: 'string',
          description: 'Nombre del usuario',
          example: 'Juan',
        },
        apellido: {
          type: 'string',
          description: 'Apellido del usuario',
          example: 'Pérez',
        },
        fechaDeNacimiento: {
          type: 'string',
          format: 'date',
          description: 'Fecha de nacimiento',
          example: '20-01-2001',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Email del usuario',
          example: 'juan@example.com',
        },
        direccion: {
          type: 'string',
          description: 'Dirección del usuario',
          example: 'Calle 123, Ciudad',
        },
      },
    },
  })
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('fotoPerfil', {
      fileFilter: (req, file, cb) => {
        if (file && /^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de archivo no permitido. Solo imágenes.'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'img', 'usuarios');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.ADMIN, RoleEnum.COLABORADOR)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto, @UploadedFile() fotoPerfil?: Express.Multer.File) {
    if (fotoPerfil) {
      // Servido como estático en /img
      updateUsuarioDto.fotoPerfil = `/img/usuarios/${fotoPerfil.filename}`;
    }
    console.log('controlador: ', updateUsuarioDto);
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @ApiCustomOperation({
    summary: 'Eliminar un usuario por id',
    responseStatus: 200,
    responseDescription: 'Usuario eliminado correctamente',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }

  @ApiCustomOperation({
    summary: 'Guardar un juego',
    bodyType: GuardarJuegoDto,
    responseStatus: 200,
    responseDescription: 'Juego guardado correctamente',
  })
  @Post('/guardar-juego')
  
  guardarJuego(@Body() guardarJuegoDto: GuardarJuegoDto) {
    return this.usuariosService.guardarJuego(guardarJuegoDto);
  }

  @ApiCustomOperation({
    summary: 'Cargar un juego',
    bodyType: CargarJuegoDto,
    responseStatus: 200,
    responseDescription: 'Juego cargado correctamente',
  })
  @Get('/cargar-juego')
  cargarJuego(@Body() cargarJuegoDto: CargarJuegoDto) {
    return this.usuariosService.cargarJuego(cargarJuegoDto);
  }
}
