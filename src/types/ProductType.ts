export interface IProduct {
  id: string;
  productCategoryId: string;
  name: string;
  price: number;
  description: string;
  sku: number;
  sold: number;
  discountSold: number;
  discountPercent: number;
  coverImage: string;
  createdOnUtc: string;
  modifiedOnUtc: string;
  createdBy: string;
  updatedBy: string;
  productCategory: {
    name: string;
    description: string;
  };
  productImageList: Array<{
    imageUrl: string;
  }>;
  productFeedbackList: Array<{
    rate: number;
    total: number;
  }>;
}

export interface IProductListResponse {
  items: IProduct[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
