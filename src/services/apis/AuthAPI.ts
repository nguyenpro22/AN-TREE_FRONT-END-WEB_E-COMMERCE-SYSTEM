// authAPI.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IResCommon,
  ILoginResponse,
  IRegisterResponse,
  ILogin,
  IRegister,
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
    refreshToken: builder.mutation<
      IResCommon<ILoginResponse>,
      { accessToken: string; refreshToken: string }
    >({
      query: (body) => ({
        url: `/auth/refresh_token`,
        method: "POST",
        body,
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
      IResCommon<string>,
      { email: string; newPassword: string }
    >({
      query: (body) => ({
        url: `/auth/change_password`,
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<
      IResCommon<IRegisterResponse>,
      Partial<IRegister>
    >({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body,
      }),
    }),
    validateToken: builder.mutation<
      IResCommon<ILoginResponse>,
      { accessToken: string; refreshToken: string }
    >({
      query: (body) => ({
        url: "/auth/refresh_token",
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
  useValidateTokenMutation,
} = authAPI;
