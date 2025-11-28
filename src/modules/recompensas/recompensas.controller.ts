import {Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards} from '@nestjs/common';
import { RecompensasService } from './recompensas.service';
import { CreateCanjeDto, CreateRecompensaDto, UpdateRecompensaDto } from './dto/create-recompensa.dto';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { SupabaseService } from '../supabase/supabase.service';

@ApiTags('Recompensas')


@Controller('recompensas')
export class RecompensasController {
  constructor(
    private readonly recompensasService: RecompensasService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @ApiCustomOperation({
    summary: 'Crear una recompensa',
    responseStatus: 200,
    responseDescription: 'Recompensa creada correctamente',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        titulo: { type: 'string', description: 'Titulo de la recompensa', example: 'Recompensa 1' },
        descripcion: { type: 'string', description: 'Descripción de la recompensa', example: 'Recompensa 1' },
        puntos: { type: 'number', description: 'Puntos de la recompensa', example: 100 },
        cantidad: { type: 'number', description: 'Cantidad de la recompensa', example: 100 },
        foto: { type: 'string', format: 'binary' },
      },
      required: ['titulo', 'descripcion', 'puntos', 'cantidad', 'foto'],
    },
  })
  @UseInterceptors(
    FileInterceptor('foto', {
      fileFilter: (req, file, cb) => {
        if (/^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de archivo no permitido. Solo imágenes.'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: memoryStorage(),
    }),
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.ADMIN)
  @Post()
  async create(@Body() createRecompensaDto: CreateRecompensaDto, @UploadedFile() foto: Express.Multer.File) {
    if (foto) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(foto.originalname);
      const fileName = `${uniqueSuffix}${fileExt}`;
      
      const publicUrl = await this.supabaseService.uploadFile(
        'recompensas',
        fileName,
        foto,
        foto.mimetype,
      );
      
      createRecompensaDto.foto = publicUrl;
    }
    return this.recompensasService.create(createRecompensaDto);
  }

  @ApiCustomOperation({
    summary: 'Crear un canje',
    bodyType: CreateCanjeDto,
    responseStatus: 200,
    responseDescription: 'Canje creado correctamente',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
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
  @Get()
  findAll() {
    return this.recompensasService.findAll();
  }

  @ApiCustomOperation({
    summary: 'Obtener una recompensa por id',
    responseStatus: 200,
    responseDescription: 'Recompensa obtenida correctamente',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recompensasService.findOne(id);
  }

  @ApiCustomOperation({
    summary: 'Obtener todos los canjes de un usuario',
    responseStatus: 200,
    responseDescription: 'Canjes obtenidos correctamente',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.ADMIN, RoleEnum.COLABORADOR, RoleEnum.USUARIO)
  @Get('canjes/:usuarioId')
  findAllCanjesOnUser(@Param('usuarioId') usuarioId: string) {
    return this.recompensasService.findAllCanjesOnUser(usuarioId);
  }

  @ApiCustomOperation({
    summary: 'Actualizar una recompensa por id',
    responseStatus: 200,
    responseDescription: 'Recompensa actualizada correctamente',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        titulo: { type: 'string', description: 'Titulo de la recompensa', example: 'Recompensa 1' },
        descripcion: { type: 'string', description: 'Descripción de la recompensa', example: 'Recompensa 1' },
        puntos: { type: 'number', description: 'Puntos de la recompensa', example: 100 },
        cantidad: { type: 'number', description: 'Cantidad de la recompensa', example: 100 },
        foto: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('foto', {
      fileFilter: (req, file, cb) => {
        if (/^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de archivo no permitido. Solo imágenes.'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: memoryStorage(),
    }),
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRecompensaDto: UpdateRecompensaDto, @UploadedFile() foto: Express.Multer.File) {
    if (foto) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(foto.originalname);
      const fileName = `${uniqueSuffix}${fileExt}`;
      
      const publicUrl = await this.supabaseService.uploadFile(
        'recompensas',
        fileName,
        foto,
        foto.mimetype,
      );
      
      updateRecompensaDto.foto = publicUrl;
    }
    return this.recompensasService.update(id, updateRecompensaDto);
  }

  @ApiCustomOperation({
    summary: 'Eliminar una recompensa por id',
    responseStatus: 200,
    responseDescription: 'Recompensa eliminada correctamente',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recompensasService.remove(id);
  }
}
