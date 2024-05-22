import * as winston from 'winston';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';
import { ENVIRONMENT } from './commons/enums';
import { AppController } from './app.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import configs from './configurations/environment.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ByAuthModule } from './controllers/by-auth/by-auth.module';
import { AllExceptionsFilter } from './commons/all-exceptions.filter';
import { AppConfigurationModule } from './configurations/config.module';
import { ByCoreController } from './controllers/by-core/by-core.controller';
import { ByAuthController } from './controllers/by-auth/by-auth.controller';
import { ByAdminController } from './controllers/by-admin/by-admin.controller';
// import { JwtAuthGuard } from './controllers/by-auth/by-guards/by-jwt-auth.guard';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

import pino from 'pino';
import { ByLocalGuard } from './controllers/by-auth/by-guards/by-local.guard';

const env = configs();

export const transportOptions =
  env[ENVIRONMENT.NODE_ENV] !== 'production'
    ? {
        transport: { target: 'pino-pretty' },
      }
    : {};

@Module({
  imports: [
    AppConfigurationModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('API', {
              prettyPrint: false,
            }),
          ),
        }),
      ],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          logger: pino(),
          name: 'add some name to every JSON line',
          serializers: {
            err: pino.stdSerializers.err,
            req: pino.stdSerializers.req,
            res: pino.stdSerializers.res,
          },
          level:
            configService.get<string>(ENVIRONMENT.NODE_ENV) !== 'production'
              ? 'debug'
              : 'error',
          // install 'pino-pretty' package in order to use the following option
          ...transportOptions,
          useLevelLabels: true,
          customLogLevel: function (res, err) {
            if (res.statusCode >= 400 && res.statusCode < 500) {
              return 'warn';
            } else if (res.statusCode >= 500 || err) {
              return 'error';
            } else if (res.statusCode >= 300 && res.statusCode < 400) {
              return 'silent';
            }
            return 'info';
          },
          // Define a custom success message
          customSuccessMessage: function (res) {
            if (res.statusCode === 404) {
              return 'resource not found';
            }
            return 'request completed';
          },
          // Define a custom receive message
          customReceivedMessage: function (req, _res) {
            console.debug('_res: ', _res);
            return 'request received: ' + req.method;
          },
          // Override attribute keys for the log object
          customAttributeKeys: {
            req: 'request',
            res: 'response',
            err: 'error',
            responseTime: 'timeTaken',
          },
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule.register({
      // timeout: env[ENVIRONMENT.HTTP_TIMEOUT],
      maxRedirects: env[ENVIRONMENT.HTTP_MAX_REDIRECTS],
    }),
    // Healthcheck and metric interceptor
    ByAuthModule,
  ],
  controllers: [
    AppController,
    ByAdminController,
    ByCoreController,
    ByAuthController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ByLocalGuard,
    },
  ],
})
export class AppModule {}
