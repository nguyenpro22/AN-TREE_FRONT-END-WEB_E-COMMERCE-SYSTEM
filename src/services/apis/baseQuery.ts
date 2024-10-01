import { CookieStorageKey } from "@/constants";
import {
  clearToken,
  getAccessToken,
  getCookie,
  getRefreshToken,
  setAccessToken,
} from "@/utils";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

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

export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshArgs = {
      url: `${process.env["NEXT_PUBLIC_API_URL"]}/auth/refresh_token`,
      method: "POST",
      body: {
        accessToken: getAccessToken(),
        refreshToken: getRefreshToken(),
      },
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
    };

    const { data }: { [key: string]: any } = await baseQuery(
      refreshArgs,
      api,
      extraOptions
    );

    if (data) {
      setAccessToken(data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      clearToken();
      window.location.href = "/auth";
    }
  }

  if (result.error && result.error.status === 403) {
    // Forbidden access, optionally handle it
    // window.location.href = PublicRoute.HOME;
  }

  return result;
};
