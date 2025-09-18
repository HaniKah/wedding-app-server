import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  providers: [DbService],
  exports: [DbService],
  imports: [ConfigModule.forRoot()],
})
export class DbModule {}
