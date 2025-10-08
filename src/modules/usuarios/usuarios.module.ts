import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import JwtModuleConfig from 'src/config/jwt.config';

@Module({
  imports: [JwtModuleConfig()],
  controllers: [ UsuariosController],
  providers: [UsuariosService, JwtStrategy],
})
export class UsuariosModule {}
