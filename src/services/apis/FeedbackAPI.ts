import { IFeedbackList, IResCommon } from "@/types"; // Ensure you have the correct imports
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQuery";

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  tagTypes: ["Feedback"],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getAllFeedback: builder.query<
      IResCommon<IFeedbackList>,
      {
        productId: string;
        sortColumn?: string;
        sortOrder?: "asc" | "desc";
        pageIndex?: number;
        pageSize?: number;
      }
    >({
      query: ({
        productId,
        sortColumn,
        sortOrder = "asc",
        pageIndex = 1,
        pageSize = 10,
      }) => ({
        url: `/feedbacks`,
        params: {
          productId,
          sortColumn,
          sortOrder,
          pageIndex,
          pageSize,
        },
      }),
      providesTags: ["Feedback"],
    }),
    // ... other endpoints
  }),
});

export const {
  useGetAllFeedbackQuery,
  // ... other hooks
} = feedbackApi;
