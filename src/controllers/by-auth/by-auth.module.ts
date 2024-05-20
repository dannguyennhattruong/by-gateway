import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
// import configs from '../../configurations/environment.config';
import { ByAuthService } from './by-auth.service';
import { ByAuthController } from './by-auth.controller';
// import { ENVIRONMENT } from 'src/commons/enums';
import { ByJwtStrategy } from './by-strategies/by-jwt.strategy';
import { jwtConstants } from './by-auth.constants';
import { ByLocalStrategy } from './by-strategies/by-local.strategy';

// const env = configs();
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      // env[ENVIRONMENT.JWT_SECRET],
      signOptions: {
        expiresIn: '1h',
        // env[ENVIRONMENT.JWT_EXPIRED_TIME]
      },
    }),
    HttpModule,
  ],
  providers: [ByAuthService, ByJwtStrategy, ByLocalStrategy],
  controllers: [ByAuthController],
  exports: [ByAuthService],
})
export class ByAuthModule {}
