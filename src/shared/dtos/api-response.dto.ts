import { BasePaginationResponseDto } from './base.pagination.response.dto';

export class ApiResponseDto<T = unknown> {
  success: boolean;

  correlationId?: string;

  result?: T;

  message?: string | string[];

  pagination?: BasePaginationResponseDto;

  constructor(
    success: boolean,
    result?: T,
    correlationId?: string,
    message?: string | string[],
    pagination?: BasePaginationResponseDto,
  ) {
    this.success = success;
    this.correlationId = correlationId;
    this.result = result;
    this.message = message;
    this.pagination = pagination;
  }
}
