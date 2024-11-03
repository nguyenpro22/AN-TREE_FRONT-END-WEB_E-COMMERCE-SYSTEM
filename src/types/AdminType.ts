// Order response interface
export interface OrderResponse {
  orderId: string;
  vendorId: string;
  total: number;
  status: number;
  createdOnUtc: string;
  vendorName: string;
}

// Transaction response interface
export interface TransactionResponse {
  id: string;
  email: string;
  subscriptionName: string;
  total: number;
  status: number;
  createdAt: string;
}

export interface DashboardAmount {
  totalOrder: number;
  totalTransaction: number;
  totalVendor: number;
  totalCustomer: number;
  totalFreeSubscription: number;
  totalBuySubscription: number;
}

export interface DashboardSubscription {
  no: number;
  startDate: string;
  endDate: string;
  subscriptionName: string;
  subscriptionNumber: string;
  subscriptionTotal: string;
}
