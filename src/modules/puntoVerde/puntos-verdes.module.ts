import { Module } from '@nestjs/common';
import { PuntosVerdesService } from './puntos-verdes.service';
import { PuntosVerdesController } from './puntos-verdes.controller';

@Module({
  controllers: [PuntosVerdesController],
  providers: [PuntosVerdesService],
})
export class PuntosVerdesModule {}
