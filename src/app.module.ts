import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlannerModule } from './planner/planner.module';
import { GoogleApiModule } from './google-api/google-api.module';
import { DbModule } from './db/db.module';
import { GuestsModule } from './guests/guests.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlacesModule } from './places/places.module';
import { MinioModule } from './minio/minio.module';
import { PhotosModule } from './photos/photos.module';
import { PackagesModule } from './packages/packages.module';

@Module({
  imports: [
    PlannerModule,
    GoogleApiModule,
    DbModule,
    GuestsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    AuthModule,
    UsersModule,
    UsersModule,
    PlacesModule,
    MinioModule,
    PhotosModule,
    PackagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
