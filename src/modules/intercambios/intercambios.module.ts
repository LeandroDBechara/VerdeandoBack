import { Module } from '@nestjs/common';
import { IntercambiosService } from './intercambios.service';
import { IntercambiosController } from './intercambios.controller';

@Module({
  controllers: [IntercambiosController],
  providers: [IntercambiosService],
})
export class IntercambiosModule {}
