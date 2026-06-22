import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppVersionController } from './app-version.controller';
import { AppVersionService } from './app-version.service';
import appVersionConfig from './config/app-version.config';

@Module({
  imports: [ConfigModule.forFeature(appVersionConfig)],
  controllers: [AppVersionController],
  providers: [AppVersionService],
  exports: [AppVersionService],
})
export class AppVersionModule {}
