import { Order, IListResponse, IResCommon, OrderDetailResponse } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQuery";

export const orderApi = createApi({
  reducerPath: "orderApi",
  tagTypes: ["Order"],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getOrders: builder.query<
      IResCommon<IListResponse<Order>>,
      {
        pageIndex?: number;
        pageSize?: number;
        sortColumn?: string;
        sortOrder?: "asc" | "desc";
        notFeedback?: boolean;
      }
    >({
      query: ({
        pageIndex = 1,
        pageSize = 10,
        sortColumn = "",
        sortOrder = "",
        notFeedback = false,
      }) => ({
        url: `/orders`,
        params: {
          pageIndex,
          pageSize,
          sortColumn,
          sortOrder,
          notFeedback,
        },
      }),
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<OrderDetailResponse, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
      }),
      providesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery } = orderApi;
