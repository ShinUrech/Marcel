/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger as WinstonLogger } from 'winston';

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private httpAdapterHost: HttpAdapterHost,
    @Inject('winston') private readonly winstonLogger: WinstonLogger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Unknown error occurred';

    this.logger.error(`Exception :${message}, stack ${exception.stack}`);
    this.winstonLogger.error(`Exception :${message}, stack ${exception.stack}`);
    const request = ctx.getRequest();

    // Logging the exception using Winston
    this.winstonLogger.error(`HTTP Status: ${status} Error Message: ${message}`, {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });

    const responseBody = { status: status, message };
    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}

export default AllExceptionsFilter;
