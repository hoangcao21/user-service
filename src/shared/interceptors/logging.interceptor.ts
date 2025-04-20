import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();

    const apiURL = request.url;
    const apiMethod = request.method;

    Logger.log('➡️ Incoming Request ', {
      url: apiURL,
      method: apiMethod,
      body: request?.body as unknown,
    });

    return next.handle().pipe(
      tap((response) => {
        const res = context.switchToHttp().getResponse<Response>();

        Logger.log('⬅️ Outgoing Response ', {
          url: apiURL,
          method: apiMethod,
          body: response,
          statusCode: res.statusCode,
        });
      }),
    );
  }
}
