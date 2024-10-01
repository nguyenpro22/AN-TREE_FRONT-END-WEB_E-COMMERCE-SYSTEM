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
    logout: builder.mutation<IResCommon<string>, void>({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
    }),
    forgetPassword: builder.mutation<IResCommon<string>, { email: string }>({
      query: (body) => ({
        url: `/auth/forgot_password`,
        method: "POST",
        body,
      }),
    }),
    verifyOTP: builder.mutation<
      IResCommon<ILoginResponse>,
      { email: string; code: string }
    >({
      query: (body) => ({
        url: `/auth/verify_code`,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      IResCommon<Object>,
      { email: string; newPassword: string }
    >({
      query: (body) => ({
        url: `/auth/change_password`,
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<IResCommon<IRegisterResponse>, Partial<IUser>>({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgetPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
} = authAPI;
