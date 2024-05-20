import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ByAuthService } from '../by-auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ByLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: ByAuthService) {
    super();
  }

  validate(username: string, password: string) {
    const account = this.authService.validateAccount({ username, password });
    if (!account) throw new UnauthorizedException();
    return account;
  }
}
