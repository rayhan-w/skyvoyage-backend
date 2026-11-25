import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { IncomingMessage, ServerResponse } from 'http';
import { AppModule } from '../src/app.module.js';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter.js';

let cachedHandler: ((req: IncomingMessage, res: ServerResponse) => void) | null = null;

async function getHandler() {
  if (cachedHandler) return cachedHandler;

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const frontendUrl = configService.get<string>('FRONTEND_URL') || '*';
  app.enableCors({
    origin:
      frontendUrl === '*'
        ? true
        : frontendUrl.split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();
  cachedHandler = app.getHttpAdapter().getInstance() as (
    req: IncomingMessage,
    res: ServerResponse,
  ) => void;
  return cachedHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const server = await getHandler();
  return server(req, res);
}
