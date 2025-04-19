import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string = 'UNEXPECTED_ERROR';
    let errorMessage: string | string[] = 'Unexpected Error';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();

      const errorResponse = exception.getResponse() as {
        message: string | string[];
        error: string;
      };

      const isMessageArray = errorResponse.message instanceof Array;

      errorCode = !isMessageArray
        ? (errorResponse.message as string)
        : 'VALIDATION_ERROR';
      errorMessage = isMessageArray
        ? errorResponse.message
        : errorResponse.error;
    }

    const responseBody = {
      statusCode: httpStatus,
      errorCode: errorCode,
      errorMessage: errorMessage,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
