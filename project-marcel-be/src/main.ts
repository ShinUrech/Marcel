/* eslint-disable prettier/prettier */
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import AllExceptionsFilter from './common/global-filters/all-exceptions.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // Enable Cors
  app.enableCors();

  // Getting the Winston logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logger));
  app.use(morgan('tiny'));

  app.setGlobalPrefix('api');

  const PORT = configService.get('port') || 10000;
  await app.listen(PORT, '0.0.0.0', () => {
    const NODE_ENV = configService.get('nodeEnv');
    console.log(`Server is Running on port : ${PORT}! | Execution Environment : ${NODE_ENV.toLocaleUpperCase()}`);
  });
}
bootstrap();
