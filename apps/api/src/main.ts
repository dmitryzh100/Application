import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { validateEnv } from './common/config/env.validation';

async function bootstrap(): Promise<void> {
  const env = validateEnv(process.env as Record<string, unknown>);

  const app = await NestFactory.create(AppModule);

  if (env.NODE_ENV === 'production') {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);
  }

  app.enableShutdownHooks();
  app.use(cookieParser());

  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.enableCors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Event Management API')
    .setDescription('API for the Event Management System')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.BACKEND_PORT);
  console.log(`Application running on port ${env.BACKEND_PORT}`);
  console.log(`Swagger docs at http://localhost:${env.BACKEND_PORT}/api/docs`);
}

bootstrap();
