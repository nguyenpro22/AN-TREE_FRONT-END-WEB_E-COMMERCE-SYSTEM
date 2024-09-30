export interface IPathname {
  [key: string]:
    | string
    | { pathname: string; params: string[]; isPreview?: boolean };
}

export type TPathname = {
  pathname: string;
  params: string[];
  isPreview?: boolean;
};

export enum ENUM_LABEL {
  UNSPECIFIED,
  NEW,
  QUALIFIED,
  UNQUALIFIED,
  SOLVE,
  SPAM,
}
