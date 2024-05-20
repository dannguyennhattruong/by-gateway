import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { ENVIRONMENT } from 'src/commons/enums';
import { ByAuthService } from '../by-auth.service';
import { ENVIRONMENT } from 'src/commons/enums';

@Injectable()
export class ByJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private wolAuthService: ByAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ENVIRONMENT.JWT_SECRET),
    });
  }

  async validate(payload) {
    // TODO check with redis later
    // const valid_account = await this.wolAuthService.validateAccount(payload);
    if (payload?.user_name) {
      return payload;
    }

    return {
      address: payload.address,
      nonce: payload.nonce,
      status: payload.status,
    };
  }
}
