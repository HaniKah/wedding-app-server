import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import AppVersionConfig from './config/app-version.config';

@Injectable()
export class AppVersionService {
  constructor(
    @Inject(AppVersionConfig.KEY)
    private readonly appVersionConfig: ConfigType<typeof AppVersionConfig>,
  ) {}

  getConfig() {
    return this.appVersionConfig;
  }
}
