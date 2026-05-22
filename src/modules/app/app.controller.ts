import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/api/auth/reset-password/:token')
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
  @Get('/dashboard')
  @Render('dashboard')
  confirmEmail() {
    return { message: 'Hello world!' };
  }
}