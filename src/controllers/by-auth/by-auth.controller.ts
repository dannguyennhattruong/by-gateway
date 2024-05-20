import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/base.controller';
import { ByAuthService } from './by-auth.service';
import { JwtAuthGuard } from './by-guards/by-jwt-auth.guard';
import { ByLocalGuard } from './by-guards/by-local.guard';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class ByAuthController extends BaseController {
  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    private authService: ByAuthService,
  ) {
    super(httpService, configService);
  }
  @UseGuards(ByLocalGuard)
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
