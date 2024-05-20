import { HttpService } from '@nestjs/axios';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/base.controller';

@ApiTags('core')
@Controller('core')
export class ByCoreController extends BaseController {
  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
  ) {
    super(httpService, configService);
  }
}
