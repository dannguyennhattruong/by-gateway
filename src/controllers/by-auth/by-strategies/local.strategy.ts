import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ByAuthService } from '../by-auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: ByAuthService) {
    super();
  }

  validate(username: string, password: string) {
    const user = this.authService.validateAccount({ username, password });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
