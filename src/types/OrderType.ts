export type User = {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
};

export type Order = {
  id: string;
  address: string;
  note: string;
  total: number;
  status: number;
  isFeedback: boolean;
  createdOnUtc: string;
  discount: number | null;
  user: User;
};

export type OrderDetail = {
  id: string;
  productQuantity: number;
  productName: string;
  productPrice: number;
  productPriceDiscount: number;
  orderDetailFeedback: null | any; // Replace 'any' with a more specific type if available
};

export type OrderDetailResponse = {
  id: string;
  address: string;
  note: string;
  total: number;
  status: number;
  isFeedback: boolean;
  createdOnUtc: string;
  discount: null | number;
  orderDetails: OrderDetail[];
};
// You can also define an enum for the order status if you want to use it throughout your application
// types.ts
export interface OrderStatusType {
  status: number;
  description: string;
  bg_Color: string;
  txt_Color: string;
}

export const OrderStatus: Record<number, OrderStatusType> = {
  0: {
    status: 0,
    description: "Pending",
    bg_Color: "bg-blue-200",
    txt_Color: "text-blue-800",
  },
  1: {
    status: 1,
    description: "Failed",
    bg_Color: "bg-yellow-200",
    txt_Color: "text-yellow-800",
  },
  2: {
    status: 2,
    description: "Success",
    bg_Color: "bg-green-200",
    txt_Color: "text-green-800",
  },
};

// Optionally add a method to get status by code
export const getStatusByCode = (code: number): OrderStatusType | undefined => {
  return Object.values(OrderStatus).find((status) => status.status === code);
};
