import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Max } from 'class-validator';

import { PaginationSortingOrder, QueryPagination } from './pagination';

export class BasePaginationRequestDto {
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page: number = 1;

  @Max(200)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  pageSize: number = 10;

  @IsOptional()
  sortKey?: string;

  @IsEnum(PaginationSortingOrder)
  @IsOptional()
  sortType?: PaginationSortingOrder = PaginationSortingOrder.ASCENDING;

  toPagination(): QueryPagination {
    return new QueryPagination({
      page: this.page,
      pageSize: this.pageSize,
      sortKey: this.sortKey,
      sortType: this.sortType,
    });
  }
}
