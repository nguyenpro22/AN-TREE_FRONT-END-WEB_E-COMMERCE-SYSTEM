import { createApi } from "@reduxjs/toolkit/query/react";
import { DashboardOrder, ILoginResponse, IResCommon, IUser } from "@/types";
import { baseQueryWithReAuth } from "./baseQuery";

export const VendorAPI = createApi({
  reducerPath: "VendorAPI",
  tagTypes: ["Vendor"],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getVendorProfile: builder.query<IResCommon<IUser>, void>({
      query: () => ({
        url: `/vendors/me`,
      }),
      providesTags: ["Vendor"],
    }),
    createVendor: builder.mutation<IResCommon<ILoginResponse>, FormData>({
      query: (body) => ({
        url: `/vendors`,
        method: "POST",
        body,
      }),
    }),
    updateVendor: builder.mutation<IResCommon<string>, FormData>({
      query: (body) => ({
        url: `/vendors`,
        method: "PUT",
        body,
      }),
    }),
    getVendorRevenue: builder.query<
      IResCommon<DashboardOrder[]>,
      { month?: string; year?: string; isOrder?: boolean }
    >({
      query: ({ month, year, isOrder = true }) => ({
        url: `/dashboards/Revenue`,
        params: { month, year, isOrder },
      }),
    }),
  }),
});

export const {
  useGetVendorProfileQuery,
  useLazyGetVendorProfileQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useGetVendorRevenueQuery,
} = VendorAPI;
