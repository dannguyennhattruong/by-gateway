import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/base.controller';
import { ByAuthService } from './by-auth.service';
// import { JwtAuthGuard } from './by-guards/by-jwt-auth.guard';
import { ByAccountDto } from './by-auth-dto/by-account-dto';
import { LocalGuard } from './by-guards/local.guard';
import { Request } from 'express';

// @ApiTags('auth')
@Controller('auth')
export class ByAuthController extends BaseController {
  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    private authService: ByAuthService,
  ) {
    super(httpService, configService);
  }
  @UseGuards(LocalGuard)
  @Post('login')
  login(@Body() authPayload: ByAccountDto) {
    const user = this.authService.validateAccount(authPayload);
    return user;
  }

  @Get('status')
  status(@Req() req: Request) {
    req.user;
  }
}
