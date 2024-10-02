import { getRefreshTokenExpiryTime } from "./../../utils/tokenUtils";
import { CookieStorageKey } from "@/constants";
import { ILoginResponse, IResCommon } from "@/types";
import {
  clearToken,
  getAccessToken,
  getCookie,
  getRefreshToken,
  isTokenExpired,
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
  // Check if the refresh token is expired or if the access token is expired
  if (getAccessToken()) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh_token",
        method: "POST",
        body: {
          accessToken: getAccessToken(),
          refreshToken: getRefreshToken(),
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Update the tokens after a successful refresh
      const { value } = refreshResult.data as IResCommon<ILoginResponse>;

      // Set the new access token and refresh token
      setAccessToken(value.accessToken);
      setRefreshToken(value.refreshToken);
      setRefreshTokenExpiryTime(value.refreshTokenExpiryTime);
    } else {
      // If token refresh fails, clear tokens and handle unauthorized access
      alert(isTokenExpired());
      clearToken();
      alert("Session expired. Please log in again.");
      return { error: { status: 401, data: "Unauthorized" } };
    }
  }

  // After refreshing the token, proceed with the original request
  const result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized error (if the request fails after token refresh)
  if (result.error && result.error.status === 401) {
    clearToken();
    alert("Unauthorized access. Redirecting to login.");
    // Optionally redirect to login page
    window.location.href = "/auth";
  }

  // Handle 403 Forbidden error
  if (result.error && result.error.status === 403) {
    alert("Access forbidden.");
    // Optionally handle forbidden access
    // window.location.href = PublicRoute.HOME;
  }

  return result;
};
