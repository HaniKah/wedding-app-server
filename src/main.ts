import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';
import * as fs from 'node:fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();
  app.setGlobalPrefix('api');

  //todo : swagger openApi is running in production also , which is not ideal , change following :
  // 1. uninstall swagger , install using --save-dev
  // 2. wrap following to be executed only in dev mode ( process.env.NODE_ENV === 'development')
  const config = new DocumentBuilder()
    .setTitle('Wedding Planner')
    .setDescription('this is the Open Api docs for the wedding planner')
    .setVersion('1.0')
    .addTag('wedApp Tag')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  //todo: you might not want to expose to all (0.0.0.0) check if this has to be deleted
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
