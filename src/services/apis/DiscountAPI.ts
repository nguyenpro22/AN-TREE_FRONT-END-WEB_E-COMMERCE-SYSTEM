import {
  IDiscount,
  IDiscountResponse,
  IListResponse,
  IPutDiscount,
  IResCommon,
} from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQuery";

// Define default values
const DEFAULT_PAGE_INDEX = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_COLUMN = "1";
const DEFAULT_SORT_ORDER = "1";

export const productDiscountApi = createApi({
  reducerPath: "productDiscountApi",
  tagTypes: ["ProductDiscount"],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getProductDiscounts: builder.query<
      IResCommon<IListResponse<IDiscountResponse>>,
      {
        productId: string;
        isRelease?: boolean;
        sortColumn?: string;
        sortOrder?: string;
        pageIndex?: number;
        pageSize?: number;
      }
    >({
      query: ({
        productId,
        isRelease = false,
        sortColumn = DEFAULT_SORT_COLUMN,
        sortOrder = DEFAULT_SORT_ORDER,
        pageIndex = DEFAULT_PAGE_INDEX,
        pageSize = DEFAULT_PAGE_SIZE,
      }) => ({
        url: `/productDiscounts/${productId}`,
        params: { isRelease, sortColumn, sortOrder, pageIndex, pageSize },
      }),
      providesTags: ["ProductDiscount"],
    }),

    createProductDiscount: builder.mutation<
      IResCommon<string>,
      Partial<IDiscount>
    >({
      query: (discount) => ({
        url: "/productDiscounts",
        method: "POST",
        body: discount,
      }),
      invalidatesTags: ["ProductDiscount"],
    }),

    updateProductDiscount: builder.mutation<
      IResCommon<string>,
      Partial<IPutDiscount>
    >({
      query: (discount) => ({
        url: "/productDiscounts",
        method: "PUT",
        body: discount,
      }),
      invalidatesTags: ["ProductDiscount"],
    }),

    deleteProductDiscount: builder.mutation<IResCommon<void>, string>({
      query: (discountId) => ({
        url: `/productDiscounts/${discountId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductDiscount"],
    }),
  }),
});

export const {
  useGetProductDiscountsQuery,
  useLazyGetProductDiscountsQuery,
  useCreateProductDiscountMutation,
  useUpdateProductDiscountMutation,
  useDeleteProductDiscountMutation,
} = productDiscountApi;
