export enum PaginationSortingOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
}

export class QueryPagination {
  public page: number;
  public pageSize: number;
  public sortKey?: string;
  public sortType?: PaginationSortingOrder;

  constructor(props: QueryPagination) {
    Object.assign(this, props);
  }
}
