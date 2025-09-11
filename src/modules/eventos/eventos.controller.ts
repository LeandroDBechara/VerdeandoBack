import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto, UpdateEventoDto } from './dto/create-evento.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

//@UseGuards(JwtAuthGuard, RolesGuard)
//@ApiBearerAuth('access-token')
@ApiTags('Eventos')
@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @ApiCustomOperation({
    summary: 'Crear un evento',
    responseStatus: 200,
    responseDescription: 'Evento creado correctamente',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({schema: {
    type: 'object',
    properties: {
      titulo: { type: 'string', description: 'Titulo del evento' , example: 'Evento 1'},
      descripcion: { type: 'string', description: 'Descripción del evento' , example: 'Evento 1'},
      imagen: { type: 'string', format: 'binary' },
      fechaInicio: { type: 'string', description: 'Fecha de inicio del evento' , example: '01-01-2025'},
      fechaFin: { type: 'string', description: 'Fecha de fin del evento' , example: '01-01-2025'},
      codigo: { type: 'string', description: 'Código del evento' , example: '123456'},
      multiplicador: { type: 'number', description: 'Multiplicador del evento' , example: 1.0},
      puntosVerdesPermitidos: { type: 'array', items: { type: 'string' }, description: 'Puntos verdes permitidos' , example: ['123456']}
    },
    required: ['titulo', 'descripcion', 'fechaInicio', 'fechaFin', 'codigo', 'multiplicador']
  }})
  @UseInterceptors(FileInterceptor('imagen', {
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
        const uploadPath = join(process.cwd(), 'img', 'eventos');
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
  create(@Body() createEventoDto: CreateEventoDto, @UploadedFile() imagen: Express.Multer.File) {
    if (imagen) {
      createEventoDto.imagen = `/img/eventos/${imagen.filename}`;
    }
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
    bodyType: CreateEventoDto,
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
