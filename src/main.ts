import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '.well-known/assetlinks.json', method: RequestMethod.ALL },
    ],
  });

  //todo : swagger openApi is running in production also , which is not ideal , change following :
  // 1. uninstall swagger , install using --save-dev
  // 2. wrap following to be executed only in dev mode ( process.env.NODE_ENV === 'development')
  const config = new DocumentBuilder()
    .setTitle('Wedding Planner')
    .setDescription('this is the Open Api docs for the wedding planner')
    .setVersion('1.0')
    .addTag('wedApp Tag')
    .build();

  const isProduction = process.env.NODE_ENV === 'production';

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction, // true in production, false for local dev
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax', // important for cross-origin
      },
    }),
  );
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  // setInterval(() => {
  //   const used = process.memoryUsage();
  //   console.log(`RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB`);
  //   console.log(`Heap Total: ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  //   console.log(`Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  //   console.log(`External: ${(used.external / 1024 / 1024).toFixed(2)} MB`);
  //   console.log('----------------------------');
  // }, 5000); // logs every 5 seconds

  //todo: you might not want to expose to all (0.0.0.0) check if this has to be deleted
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
