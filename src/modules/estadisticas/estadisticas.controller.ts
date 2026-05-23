import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EstadisticasService } from './estadisticas.service';
import { Param } from '@nestjs/common';

@ApiTags('Estadísticas')
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

    @Get('usuarios-mas-puntos')
    async getUsuariosConMasPuntos() {
        return this.estadisticasService.getUsuariosConMasPuntos();
    }
    @Get('usuarios-mas-reciclaron')
    async getUsuariosQueMasReciclaron() {
        return this.estadisticasService.getUsuariosQueMasReciclaron();
    }
    @Get('tu-material-mas-reciclado/:usuarioId')

    async getTuMaterialMasReciclado(@Param('usuarioId') usuarioId: string) {
        return this.estadisticasService.getTuMaterialMasReciclado(usuarioId);
    }
    @Get('usuarios-mas-eventos-participaron')
    async getUsuariosQueMasEventosParticiparon() {
        return this.estadisticasService.getUsuariosQueMasEventosParticiparon();
    }
    @Get('material-mas-reciclado')
    async getMaterialMasReciclado() {
        return this.estadisticasService.getMaterialMasReciclado();
    }
    @Get('recompensas-mas-canjeadas')
    async getRecompensasMasCanjeadas() {
        return this.estadisticasService.getRecompensasMasCanjeadas();
    }
    @Get('puntos-verdes-mas-usados')
    async getPuntosVerdesMasUsados() {
        return this.estadisticasService.getPuntosVerdesMasUsados();
    }
    @Get('eventos-mayor-participacion')
    async getEventosMayorPartisipacion() {
        return this.estadisticasService.getEventosMayorPartisipacion();
    }
}