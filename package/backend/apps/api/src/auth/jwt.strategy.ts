import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { IUser } from '~libs/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      signOptions: { expiresIn: '365d' },
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<IUser> {
    const token = req.headers['authorization']!.split('Bearer ')[1];
    const user = await this.authService.validate(token);
    req.user = user;
    req.token = token;
    return user;
  }
}
