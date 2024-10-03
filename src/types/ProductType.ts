export interface IProduct {
  id: string;
  name: string;
  price: number;
  sku: number;
  sold: number;
  discountSold: number;
  discountPercent: number;
  coverImage: string;
  rating: number;
  vendorName: string;
  vendorAvatarImage: string;
}

export interface IProductDetail {
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
  vendor: {
    email: string;
    name: string;
    address: string;
    city: string;
    province: string;
    phonenumber: string;
    avatarImage: string;
    coverImage: string;
    createdOnUtc: string;
  };
  productImageList: Array<{
    imageUrl: string;
  }>;
  productFeedbackList: Array<{
    rate: number;
    total: number;
  }>;
}
