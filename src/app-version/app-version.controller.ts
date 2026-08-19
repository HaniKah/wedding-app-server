import { Controller, Get } from '@nestjs/common';
import { AppVersionService } from './app-version.service';
import { VersionDto } from '../types/version/version.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('app-version')
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}
  @Public()
  @Get('getConfig')
  getConfig(): VersionDto {
    return this.appVersionService.getConfig();
    //this is just a comment
  }
}
