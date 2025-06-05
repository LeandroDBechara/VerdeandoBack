import { Module } from '@nestjs/common';
import { RecompensasService } from './recompensas.service';
import { RecompensasController } from './recompensas.controller';

@Module({
  controllers: [RecompensasController],
  providers: [RecompensasService],
})
export class RecompensasModule {}
