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
