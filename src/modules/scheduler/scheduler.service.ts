import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventosService } from '../eventos/eventos.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly eventosService: EventosService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleEventosVencidos() {
    this.logger.log('Iniciando verificación de eventos vencidos...');
    
    try {
      const result = await this.eventosService.comprobacionVencimientoEventos();
      this.logger.log(`Verificación completada: ${result.message}`);
    } catch (error) {
      this.logger.error('Error al verificar eventos vencidos:', error);
    }
  }
}
