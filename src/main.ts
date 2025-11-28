import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, Logger, ValidationPipe} from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import { LogguerInterceptor } from './common/interceptors/logguer.interceptor';
import { corsOptions } from './config/cors.config';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));


  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector),{
      excludePrefixes: ['password', 'createdAt', 'updatedAt', 'isDeleted', 'isActive','fechaAlta','fechaActualizacion'],
      ignoreDecorators: true,
    })
  )

  setupSwagger(app);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir([join(__dirname, '..', 'public')]);
  app.setViewEngine('hbs');

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT')|| 4000;
  const NODE_ENV = configService.get<string>('NODE_ENV');

  app.useGlobalInterceptors(new LogguerInterceptor());
  
  await app.listen(PORT, '0.0.0.0', () => {
    Logger.log(
      `Application running the port: http://localhost:${PORT}/api or https://verdeandoback.onrender.com/api`,
      NestApplication.name,
    );
    Logger.log(`Current environment: ${NODE_ENV}`, NestApplication.name);
  });
}
bootstrap();