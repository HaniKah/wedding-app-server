import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlannerModule } from './planner/planner.module';
import { GoogleApiModule } from './google-api/google-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PlannerModule, GoogleApiModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
