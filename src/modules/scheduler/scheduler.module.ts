import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { EventosModule } from '../eventos/eventos.module';

@Module({
  imports: [EventosModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
