import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export const setupSwagger = (app): void => {
  const theme = new SwaggerTheme();
  const darkStyle = theme.getBuffer(SwaggerThemeNameEnum.DARK);

  const options ={
    customCss: darkStyle,
  }

  const config = new DocumentBuilder()
    .setTitle('API NESTJS')
    .setDescription('Curso de nestjs, grupo 2')
    .setVersion('1.0')
    .addTag('Proyecto 1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);
};
