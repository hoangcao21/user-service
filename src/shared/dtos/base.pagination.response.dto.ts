import { BasePaginationRequestDto } from './base.pagination.request.dto';
import { QueryPagination } from './pagination';

export class BasePaginationResponseDto extends BasePaginationRequestDto {
  total?: number;

  totalPages?: number;

  static from(
    pageResPagination: QueryPagination,
    total: number,
    totalPages: number,
  ): BasePaginationResponseDto {
    const pagination = new BasePaginationResponseDto();

    pagination.total = total;
    pagination.totalPages = totalPages;
    pagination.sortKey = pageResPagination.sortKey;
    pagination.sortType = pageResPagination.sortType;
    pagination.page = pageResPagination.page;
    pagination.pageSize = pageResPagination.pageSize;

    return pagination;
  }
}
