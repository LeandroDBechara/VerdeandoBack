import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from 'src/config/env-validation.config';
import { PrismaModule } from '../prisma/prisma.module';
import { ResiduosModule } from '../residuos/residuos.module';
import { IntercambiosModule } from '../intercambios/intercambios.module';
import { PuntosVerdesModule } from '../puntoVerde/puntos-verdes.module';
import { RecompensasModule } from '../recompensas/recompensas.module';
import { AuthModule } from '../auth/auth.module';
import { EventosModule } from '../eventos/eventos.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from '../scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidationSchema
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    ResiduosModule,
    RecompensasModule,
    PuntosVerdesModule,
    IntercambiosModule,
    EventosModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
