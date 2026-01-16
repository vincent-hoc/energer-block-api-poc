import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Timeout de 10 minutes (600000 ms)
  const server = app.getHttpServer();
  server.setTimeout(600000);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
