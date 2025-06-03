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
      ignoreExpiration: false,
      secretOrKey: ConfigService.get<string>('JWT_SECRET_KEY'),
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: JwtPayload) {
    return { userId: payload.id, email: payload.email, role: payload.role };
  }
}