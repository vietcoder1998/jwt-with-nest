import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { LoggerService } from '../logger/index';
import { Http } from '../helpers/http';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger: LoggerService = new LoggerService();

  private static handleResponse(
    response: Response,
    exception: HttpException | QueryFailedError | Error,
  ): void {
    let responseBody: any = { message: 'Internal server error' };
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors: any = null;
    let message: any = null;

    if (exception instanceof HttpException) {
      errors = exception.getResponse();
      message = 'Bad request';

      if (typeof errors['message'] == 'string') {
        message = errors['message'];
      } else if (typeof errors['message'] == 'object') {
        message = errors['message'].join('\n');
      }

      statusCode = exception.getStatus();
      responseBody = Http.responseError(message, statusCode);
    } else if (exception instanceof QueryFailedError) {
      message = exception.message;
      statusCode = HttpStatus.BAD_REQUEST;
      responseBody = Http.responseError(message, statusCode);
    } else if (exception instanceof Error) {
      message = exception.stack;
      responseBody = Http.responseError(message, statusCode);
    }

    response.status(statusCode).json(responseBody);
  }

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    // Handling error message and logging
    this.handleMessage(exception);

    // Response to client
    AllExceptionFilter.handleResponse(response, exception);
  }

  private handleMessage(
    exception: HttpException | QueryFailedError | Error,
  ): void {
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      message = JSON.stringify(exception.getResponse());
    } else if (exception instanceof QueryFailedError) {
      message = exception.stack.toString();
    } else if (exception instanceof Error) {
      message = exception.stack.toString();
    }

    this.logger.error(message);
  }
}
