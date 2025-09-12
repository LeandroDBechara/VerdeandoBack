import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors} from '@nestjs/common';

import { PuntosVerdesService } from './puntos-verdes.service';
import { CreatePuntosVerdeDto, UpdatePuntosVerdeDto } from './dto/create-puntos-verde.dto';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleEnum } from 'src/common/constants';
import { Roles } from '../../common/decorators/roles.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

//@UseGuards(JwtAuthGuard, RolesGuard)
//@ApiBearerAuth('access-token')
@ApiTags('Puntos Verdes')
@Controller('puntos-verdes')
export class PuntosVerdesController {
  constructor(private readonly puntosVerdesService: PuntosVerdesService) {}

  @ApiCustomOperation({
    summary: 'Crear un nuevo punto verde',
    responseStatus: 200,
    responseDescription: 'Punto verde creado correctamente',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imagen: { type: 'string', format: 'binary' },
        nombre: { type: 'string', description: 'Nombre del punto verde', example: 'Punto Verde 1' },
        descripcion: { type: 'string', description: 'Descripción del punto verde', example: 'Punto Verde 1' },
        direccion: { type: 'string', description: 'Dirección del punto verde', example: 'Calle 123, Ciudad' },
        latitud: { type: 'number', description: 'Latitud del punto verde', example: 10.0 },
        longitud: { type: 'number', description: 'Longitud del punto verde', example: 10.0 },
        diasHorarioAtencion: {
          type: 'string',
          description: 'Horarios de atención del punto verde',
          example: 'Lunes a Viernes 09:00 - 18:00 \n Sabado 09:00 - 13:00',
        },
        colaboradorId: {
          type: 'string',
          description: 'ID del colaborador',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        residuosAceptados: {
          type: 'array',
          items: { type: 'string' },
          description: 'Materiales aceptados del punto verde',
          example: ['Plástico', 'Vidrio'],
        },
      },
      required: ['imagen', 'nombre', 'direccion', 'latitud', 'longitud', 'diasHorarioAtencion', 'colaboradorId', 'residuosAceptados'],
    },
  })
  @Roles(RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
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
          const uploadPath = join(process.cwd(), 'img', 'puntos-verdes');
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
  @Post()
  create(@Body() createPuntosVerdeDto: CreatePuntosVerdeDto, @UploadedFile() imagen: Express.Multer.File) {
    if (imagen) {
      createPuntosVerdeDto.imagen = `/img/puntos-verdes/${imagen.filename}`;
    }
    return this.puntosVerdesService.create(createPuntosVerdeDto);
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
    bodyType: CreatePuntosVerdeDto,
    responseStatus: 200,
    responseDescription: 'Punto verde actualizado correctamente',
  })
  @Roles(RoleEnum.COLABORADOR, RoleEnum.ADMIN)
  @Patch(':id/:colaboradorId')
  update(
    @Param('id') id: string,
    @Param('colaboradorId') colaboradorId: string,
    @Body() updatePuntosVerdeDto: UpdatePuntosVerdeDto,
  ) {
    return this.puntosVerdesService.update(id, colaboradorId, updatePuntosVerdeDto);
  }

  @ApiCustomOperation({
    summary: 'Eliminar un punto verde por id',
    responseStatus: 200,
    responseDescription: 'Punto verde eliminado correctamente',
  })
  @Roles(RoleEnum.ADMIN)
  @Delete(':id/:colaboradorId')
  remove(@Param('id') id: string, @Param('colaboradorId') colaboradorId: string) {
    return this.puntosVerdesService.remove(id, colaboradorId);
  }
}
