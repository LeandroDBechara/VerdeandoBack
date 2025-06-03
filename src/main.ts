import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, Logger} from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import { LogguerInterceptor } from './common/interceptors/logguer.interceptor';
import { corsOptions } from './config/cors.config';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api/v0');


  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector),{
      excludePrefixes: ['password', 'createdAt', 'updatedAt', 'isDeleted', 'isActive'],
      ignoreDecorators: true,
    })
  )

  setupSwagger(app);

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT');
  const NODE_ENV = configService.get<string>('NODE_ENV');

  app.useGlobalInterceptors(new LogguerInterceptor());
  
  await app.listen(PORT || 3000, () => {
    Logger.log(
      `Application running the port: http://localhost:${PORT}/api`,
      NestApplication.name,
    );
    Logger.log(`Current environment: ${NODE_ENV}`, NestApplication.name);
  });
}
bootstrap();