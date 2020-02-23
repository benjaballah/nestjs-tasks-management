import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { serverConfig } from './shared/constant/config.constant';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const port = process.env.SERVER_PORT || serverConfig.port;
  const origin = process.env.SERVER_ORIGIN || serverConfig.origin;

  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
    logger.log(`Cors is enabled for "${process.env.NODE_ENV}" mode`);
  } else {
    app.enableCors({ origin });
    logger.log(`Accepting requests from origin "${origin}" of ${process.env.NODE_ENV} mode`);
  }

  await app.listen(port);

  logger.log(`Application listening on port ${port} `)
}
bootstrap();
