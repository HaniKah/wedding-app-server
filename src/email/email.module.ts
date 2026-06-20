import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import resendConfig from './config/resend.config';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(resendConfig)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
