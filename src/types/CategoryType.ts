export interface ICategory {
  id: string;
  name: string;
  description: string;
  isDeleted: boolean;
}

export interface ICategoryListResponse {
  items: ICategory[];
  totalCount: number;
}
