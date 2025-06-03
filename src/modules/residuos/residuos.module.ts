import { Module } from '@nestjs/common';
import { ResiduosService } from './residuos.service';
import { ResiduosController } from './residuos.controller';

@Module({
  controllers: [ResiduosController],
  providers: [ResiduosService],
})
export class ResiduosModule {}
