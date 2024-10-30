import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQuery";
import {
  DashboardAmount,
  DashboardOrder,
  DashboardSubscription,
  IAdmin,
  IListResponse,
  IResCommon,
  IUser,
  OrderResponse,
  TransactionResponse,
} from "@/types";

export const adminAPI = createApi({
  reducerPath: "AdminAPI",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getVendors: builder.query<
      IResCommon<IListResponse<IUser>>,
      {
        pageIndex?: number;
        pageSize?: number;
        sortColumn?: string;
        sortOrder?: "asc" | "desc";
        isPending?: boolean;
      }
    >({
      query: ({
        pageIndex = 1,
        pageSize = 10,
        sortColumn,
        sortOrder,
        isPending = false,
      }) => ({
        url: `/vendors`,
        method: "GET",
        params: {
          pageIndex,
          pageSize,
          sortColumn,
          sortOrder,
          isPending,
        },
      }),
    }),
    getOrdersAdmin: builder.query<
      IResCommon<IListResponse<OrderResponse>>,
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
        sortColumn,
        sortOrder,
        notFeedback = false,
      }) => ({
        url: `/orders`,
        method: "GET",
        params: {
          pageIndex,
          pageSize,
          sortColumn,
          sortOrder,
          notFeedback,
        },
      }),
    }),
    approveVendor: builder.mutation<
      IResCommon<string>,
      { id: string; body: { vendorId: string; isAccepted: boolean } }
    >({
      query: ({ id, body }) => ({
        url: `/vendors/${id}`,
        method: "POST",
        body,
      }),
    }),
    getTransactions: builder.query<
      IResCommon<IListResponse<TransactionResponse>>,
      { searchTerm?: string; pageIndex?: number; pageSize?: number }
    >({
      query: ({ searchTerm = "", pageIndex = 1, pageSize = 10 }) => ({
        url: `/transactions`,
        method: "GET",
        params: {
          searchTerm,
          pageIndex,
          pageSize,
        },
      }),
    }),
    getDashboardAmount: builder.query<IResCommon<DashboardAmount>, void>({
      query: () => ({ url: `/dashboards/Amount`, method: "GET" }),
    }),
    getDashboardSubscription: builder.query<
      IResCommon<DashboardSubscription[]>,
      { month?: string; year?: string; isOrder?: boolean }
    >({
      query: ({ month = "", year = "", isOrder = false }) => ({
        url: `/dashboards/Revenue`,
        method: "GET",
        params: { month, year, isOrder },
      }),
    }),
    getDashboardOrder: builder.query<
      IResCommon<DashboardOrder[]>,
      { month?: string; year?: string; isOrder?: boolean }
    >({
      query: ({ month = "", year = "", isOrder = true }) => ({
        url: `/dashboards/Revenue`,
        method: "GET",
        params: { month, year, isOrder },
      }),
    }),
    getAdminProfile: builder.query<IResCommon<IAdmin>, void>({
      query: () => ({ url: `auth/me`, method: "GET" }),
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetOrdersAdminQuery,
  useApproveVendorMutation,
  useGetTransactionsQuery,
  useGetDashboardAmountQuery,
  useGetDashboardSubscriptionQuery,
  useGetDashboardOrderQuery,
  useGetAdminProfileQuery,
  useLazyGetAdminProfileQuery,
} = adminAPI;
