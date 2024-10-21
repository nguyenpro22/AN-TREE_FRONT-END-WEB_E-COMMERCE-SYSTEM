export type IProduct = {
  readonly id: string;
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
};

export interface ProductCategory {
  name: string;
  description: string;
}

interface Vendor {
  readonly email: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phonenumber: string;
  avatarImage: string;
  coverImage: string;
  createdOnUtc: string;
}

export interface ProductImage {
  imageUrl: string;
}

export interface ProductFeedback {
  rate: number;
  total: number;
}

export interface IProductDetail {
  readonly id: string;
  readonly productCategoryId: string;
  name: string;
  price: number;
  description: string;
  sku: string;
  sold: number;
  discountSold: number;
  discountPercent: number;
  coverImage: string;
  readonly createdOnUtc: string;
  modifiedOnUtc: string;
  readonly createdBy: string;
  updatedBy: string;
  productCategory: ProductCategory;
  vendor: Vendor;
  productImageList: ReadonlyArray<ProductImage>;
  productFeedbackList: ReadonlyArray<ProductFeedback>;
}
