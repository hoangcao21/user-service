import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { ApiResponseDto } from '../dtos/api-response.dto';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler) {
    // TODO: correlation ID
    const correlationId = undefined;

    // Authentication endpoints returns only cookies (with empty body), so we should ignore sending a response
    if (
      ['signUp', 'signIn', 'rotateCredentials'].includes(
        context.getHandler().name,
      )
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data: unknown) => {
        const pagination = (<ApiResponseDto>data)?.pagination;

        if (pagination) {
          return new ApiResponseDto(
            true,
            (<ApiResponseDto>data).result,
            correlationId,
            undefined,
            pagination,
          );
        }

        return new ApiResponseDto(true, data, correlationId);
      }),
    );
  }
}
