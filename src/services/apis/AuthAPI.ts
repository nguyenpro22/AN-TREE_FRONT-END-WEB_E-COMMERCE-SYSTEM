// authAPI.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IUser,
  IResCommon,
  ILoginResponse,
  IRegisterResponse,
  ILogin,
} from "@/types";
import { baseQueryWithReAuth } from "./baseQuery";

export const authAPI = createApi({
  reducerPath: "AuthAPI",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    login: builder.mutation<IResCommon<ILoginResponse>, Partial<ILogin>>({
      query: (body) => ({
        url: `/auth/login`,
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<IResCommon<IRegisterResponse>, Partial<IUser>>({
      query: (body) => ({
        url: `/member`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authAPI;
