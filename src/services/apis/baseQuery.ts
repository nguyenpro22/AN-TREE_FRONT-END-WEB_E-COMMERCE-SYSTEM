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

// Utility function to handle token storage after refresh
const handleTokenRefresh = (data: IResCommon<ILoginResponse>) => {
  const { value } = data;
  setAccessToken(value.accessToken);
  setRefreshToken(value.refreshToken);
  setRefreshTokenExpiryTime(value.refreshTokenExpiryTime);
};

// Base query with the default authorization header
export const baseQuery = fetchBaseQuery({
  baseUrl: process.env["NEXT_PUBLIC_API_URL"],
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Base query with automatic token refresh
export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check if the request is unauthorized (401)
  if (result.error?.status === 401) {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    // If there is a token, attempt to refresh it
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
        // Update tokens on successful refresh
        handleTokenRefresh(refreshResult.data as IResCommon<ILoginResponse>);
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else if (refreshResult.error?.status === 500) {
        message.error("Session expired. Please log in again.");
        redirectToLogin();
        return { error: { status: 401, data: "Session expired" } };
      }
    } else {
      // If tokens are not available, clear them and redirect to login
      handleUnauthorized();
    }
  }

  // Handle Unauthorized (401) after token refresh
  if (result.error?.status === 401) {
    handleUnauthorized();
  }

  // Handle Forbidden (403) access
  if (result.error?.status === 403) {
    message.error("Access forbidden.");
  }

  return result;
};

// Handle redirection to login and clear tokens
const redirectToLogin = () => {
  clearToken();
  window.location.href = "/auth";
};

// Handle unauthorized access (401)
const handleUnauthorized = () => {
  message.error("Unauthorized access. Redirecting to login.");
  redirectToLogin();
};
