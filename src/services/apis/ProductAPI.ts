import { IProduct, IProductListResponse, IResCommon } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQuery";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Product"],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getProducts: builder.query<
      IResCommon<IProductListResponse>,
      {
        pageIndex?: number;
        pageSize?: number;
        categoryId?: string;
        sortColumn?: string;
        sortOrder?: "asc" | "desc";
        serchTerm?: string;
        isSale?: boolean;
      }
    >({
      query: ({
        pageIndex = 1,
        pageSize = 10,
        categoryId,
        sortColumn,
        sortOrder = "asc",
        serchTerm,
        isSale = false,
      }) => ({
        url: `/products`,
        params: {
          serchTerm,
          pageIndex,
          pageSize,
          categoryId,
          sortColumn,
          sortOrder,
          isSale,
        },
      }),
      providesTags: ["Product"],
    }),
    getProductById: builder.query<IResCommon<IProduct>, string>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<IResCommon<IProduct>, Partial<IProduct>>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<
      IResCommon<IProduct>,
      { id: string; body: Partial<IProduct> }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<IResCommon<IProduct>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
