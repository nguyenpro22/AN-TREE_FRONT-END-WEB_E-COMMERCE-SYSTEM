export interface IResCommon<T> {
  value: T;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IParamsCommon {
  [k: string]: number | string | boolean | undefined | null;
}

export interface IListResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
