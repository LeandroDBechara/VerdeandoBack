import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(ConfigService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      expiration: ConfigService.get<string>('JWT_EXPIRES_IN'),
      ignoreExpiration: false,
      secretOrKey: ConfigService.get<string>('JWT_SECRET_KEY'),
    });
  }


  async validate(payload: JwtPayload) {
    return { userId: payload.id, email: payload.email, role: payload.role };
  }
}