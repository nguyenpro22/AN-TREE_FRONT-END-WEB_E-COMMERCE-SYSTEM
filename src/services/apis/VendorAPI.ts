import { createApi } from "@reduxjs/toolkit/query/react";
import { IResCommon, IUser } from "@/types";
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
    createVendor: builder.mutation<IResCommon<string>, FormData>({
      query: (body) => ({
        url: `/vendors`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetVendorProfileQuery, useCreateVendorMutation } = VendorAPI;
