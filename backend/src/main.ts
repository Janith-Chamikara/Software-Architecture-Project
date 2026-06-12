import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Traffic Fine Management API')
    .setDescription(
      'The core REST API for national traffic fine payments and oversight.',
    )
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT token input in the Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Mounts the Swagger UI at http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  if (process.env.NODE_ENV === 'production') {
    console.log(`Running in production mode on port ${port}`);
  } else {
    console.log(`Running in development mode on port ${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/api/docs`);
  }
}
bootstrap();
