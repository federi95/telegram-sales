export interface IData<TData> {
  data: TData[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export interface IQueryParams {
  page: number;
  limit: number;
  sort: string;
}

export interface IPaginate {
  page?: number;
  limit?: number;
  total: number;
}
