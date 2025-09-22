import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_PROVIDER, EmailService } from './messanging.types';

@Injectable()
export class MessagingService {
  constructor(@Inject(EMAIL_PROVIDER) private emailService: EmailService) {}

  async sendRegisterUserEmail(input: { from: string; to: string, name: string }) {
   
    const welcomeMessage = 'Bienvenido a la plataforma';

    const { from, to, name } = input;
    const subject = welcomeMessage;
    const body = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡${welcomeMessage}!</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333;">¡${welcomeMessage}!</h2>
        <p>Hola ${name},</p>
        <p>Bienvenido a la plataforma</p>
        <img src="${process.env.URL_BACKEND}/img/logo-verdeando.png" alt="Verdeando" style="width: 100px; height: 100px;">
        <p>Gracias por registrarte</p>
    </div>
</body>
</html>`;

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }

  async sendRecoveryPassword(input: { from: string; to: string; url: string }) {
    const { from, to, url } = input;
    const subject = 'Recuperación de contraseña';
    const body = `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de contraseña</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333;">Recuperación de contraseña</h2>
        <p>Hola,</p>
        <p>Recuperación de contraseña</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Recuperación de contraseña</a>
        <p>Recuperación de contraseña</p>
        <p>Gracias por registrarte</p>
    </div>
</body>
</html>`;

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }
}
