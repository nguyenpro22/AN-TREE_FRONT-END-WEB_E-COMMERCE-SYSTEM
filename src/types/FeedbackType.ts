export interface IFeedback {
  id: string;
  createdOnUtc: string;
  orderDetailFeedback: {
    content: string;
    rating: number;
  };
  order: {
    user: {
      username: string;
      email: string;
    };
  };
}

export interface IFeedbackList {
  items: IFeedback[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
