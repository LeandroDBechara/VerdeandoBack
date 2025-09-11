import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RecompensasService } from './recompensas.service';
import { CreateCanjeDto, CreateRecompensaDto, UpdateRecompensaDto } from './dto/create-recompensa.dto';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

@ApiTags('Recompensas')
//@UseGuards(JwtAuthGuard, RolesGuard)
//@ApiBearerAuth('access-token')
@Controller('recompensas')
export class RecompensasController {
  constructor(private readonly recompensasService: RecompensasService) {}

  @ApiCustomOperation({
    summary: 'Crear una recompensa',
    responseStatus: 200,
    responseDescription: 'Recompensa creada correctamente',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({schema: {
    type: 'object',
    properties: {      
      titulo: { type: 'string', description: 'Titulo de la recompensa' , example: 'Recompensa 1'},
      descripcion: { type: 'string', description: 'Descripción de la recompensa' , example: 'Recompensa 1'},
      puntos: { type: 'number', description: 'Puntos de la recompensa' , example: 100},
      cantidad: { type: 'number', description: 'Cantidad de la recompensa' , example: 100},
      foto: { type: 'string', format: 'binary' }
    },
  }}) 
  @UseInterceptors(FileInterceptor('foto', {
    fileFilter: (req, file, cb) => {
      if (/^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Tipo de archivo no permitido. Solo imágenes.'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(process.cwd(), 'img', 'recompensas');
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
  }))
  @Roles(RoleEnum.ADMIN)
  @Post()
  create(@Body() createRecompensaDto: CreateRecompensaDto, @UploadedFile() foto: Express.Multer.File) {
    if (foto) {
      createRecompensaDto.foto = `/img/recompensas/${foto.filename}`;
    }
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
    summary: 'Obtener todos los canjes de un usuario',
    responseStatus: 200,
    responseDescription: 'Canjes obtenidos correctamente',
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.COLABORADOR, RoleEnum.USUARIO)
  @Get('canjes/:usuarioId') 
  findAllCanjesOnUser(@Param('usuarioId') usuarioId: string) {
    return this.recompensasService.findAllCanjesOnUser(usuarioId);
  }

  @ApiCustomOperation({
    summary: 'Actualizar una recompensa por id',
    bodyType: CreateRecompensaDto,
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
