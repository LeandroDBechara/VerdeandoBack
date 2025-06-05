import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterUserDto } from './dto/register.dto';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCustomOperation({
    summary: 'Register a new user',
    bodyType: RegisterUserDto,
    responseStatus: 200,
    responseDescription: 'User register successfully',
  })
  @Post('/register')
  async register(@Body() user: RegisterUserDto) {
    return await this.authService.register(user);
  }

  @ApiCustomOperation({
    summary: 'Log in user',
    bodyType: LoginAuthDto,
    responseStatus: 200,
    responseDescription: 'Logged in user',
  })
  @Post('/login')
  async login(@Body() credentials: LoginAuthDto) {
    return await this.authService.login(credentials);
  }

  @ApiCustomOperation({
    summary: 'Recovery Password',
    bodyType: RecoverPasswordDto,
    responseStatus: 200,
    responseDescription: 'Recovery email sent',
  })
  @Post('/recovery-password')
  async recoveryPassword(@Body() recoverDto: RecoverPasswordDto) {
    return await this.authService.recoveryPassword(recoverDto);
  }

  @ApiBearerAuth('access-token')
  @ApiCustomOperation({
    summary: 'Reset Password',
    bodyType: ResetPasswordDto,
    responseStatus: 200,
    responseDescription: 'Password successfully changed',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  async resetPassword(@Body() resetDto: ResetPasswordDto, @Req() req) {
    const id = req.user.userId;
    return await this.authService.resetPassword(resetDto, id);
  }
}
