import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlannerModule } from './planner/planner.module';
import { GoogleApiModule } from './google-api/google-api.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [PlannerModule, GoogleApiModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
