import { ILoginResponse, IResCommon } from "@/types";
import {
  clearToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setRefreshTokenExpiryTime,
} from "@/utils";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { message } from "antd";

// Memoize the base URL
const BASE_URL = process.env["NEXT_PUBLIC_API_URL"];

// Memoize the baseQuery function
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Use a single instance of message for all error notifications
const errorMessage = message.error;

// Optimize the baseQueryWithReAuth function
export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (accessToken && refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh_token",
          method: "POST",
          body: { accessToken, refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { value } = refreshResult.data as IResCommon<ILoginResponse>;
        setAccessToken(value.accessToken);
        setRefreshToken(value.refreshToken);
        setRefreshTokenExpiryTime(value.refreshTokenExpiryTime);
        result = await baseQuery(args, api, extraOptions);
      } else if (refreshResult.error?.status === 500) {
        errorMessage("Session expired. Please log in again.");
        clearToken();
        // window.location.href = "/auth";
        return { error: { status: 401, data: "Session expired" } };
      }
    } else {
      errorMessage("Unauthorized access. Redirecting to login.");
      clearToken();
      window.location.href = "/auth";
    }
  }

  if (result.error?.status === 401) {
    errorMessage("Unauthorized access. Redirecting to login.");
    clearToken();
    window.location.href = "/auth";
  }

  if (result.error?.status === 403) {
    errorMessage("Access forbidden.");
  }

  return result;
};
