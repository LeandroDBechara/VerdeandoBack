import { Module } from '@nestjs/common';
import { IntercambiosService } from './intercambios.service';
import { IntercambiosController } from './intercambios.controller';
import JwtModuleConfig from 'src/config/jwt.config';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { EventosService } from '../eventos/eventos.service';

@Module({
  imports: [JwtModuleConfig()],
  controllers: [IntercambiosController],
  providers: [IntercambiosService, JwtStrategy, EventosService],
})
export class IntercambiosModule {}
