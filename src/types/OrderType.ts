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

// You can also define an enum for the order status if you want to use it throughout your application
// types.ts
export interface OrderStatusType {
  status: number;
  description: string;
  bg_Color: string;
  txt_Color: string;
}

export const OrderStatus: Record<number, OrderStatusType> = {
  1: {
    status: 1,
    description: "Pending",
    bg_Color: "bg-yellow-200",
    txt_Color: "text-yellow-800",
  },
  2: {
    status: 2,
    description: "Processing",
    bg_Color: "bg-blue-200",
    txt_Color: "text-blue-800",
  },
  3: {
    status: 3,
    description: "Shipped",
    bg_Color: "bg-green-200",
    txt_Color: "text-green-800",
  },
  4: {
    status: 4,
    description: "Delivered",
    bg_Color: "bg-gray-200",
    txt_Color: "text-gray-800",
  },
};

// Optionally add a method to get status by code
export const getStatusByCode = (code: number): OrderStatusType | undefined => {
  return Object.values(OrderStatus).find((status) => status.status === code);
};
