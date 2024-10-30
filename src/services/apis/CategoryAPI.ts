import { createApi } from "@reduxjs/toolkit/query/react";
import { ICategory, ICategoryListResponse, IResCommon } from "@/types";
import { baseQueryWithReAuth } from "./baseQuery";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Category"],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getCategories: builder.query<IResCommon<ICategoryListResponse>, void>({
      query: () => ({
        url: `/categorys`,
      }),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<IResCommon<ICategory>, string>({
      query: (id) => ({
        url: `/categorys/${id}`, // Updated to match the endpoint pattern
      }),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<IResCommon<ICategory>, Partial<ICategory>>(
      {
        query: (body) => ({
          url: "/categorys", // Updated to match the endpoint
          method: "POST",
          body,
        }),
        invalidatesTags: ["Category"],
      }
    ),
    updateCategory: builder.mutation<
      IResCommon<ICategory>,
      { id: string; body: Partial<ICategory> }
    >({
      query: ({ id, body }) => ({
        url: `/categorys/${id}`, // Updated to match the endpoint pattern
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<IResCommon<ICategory>, string>({
      query: (id) => ({
        url: `/categorys/${id}`, // Updated to match the endpoint pattern
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
