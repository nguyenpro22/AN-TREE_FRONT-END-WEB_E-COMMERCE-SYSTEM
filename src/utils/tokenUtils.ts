import { CookieStorageKey, LocalStorageKey } from "@/constants";
import { clearCookieStorage, getCookie, setCookie } from "@/utils";

export const clearToken = () => {
  // clearLocalStorage();
  // clearSessionStorage();
  clearCookieStorage();
};

export const getAccessToken = (): string | null => {
  return getCookie(CookieStorageKey.ACCESS_TOKEN) == "undefined"
    ? null
    : getCookie(CookieStorageKey.ACCESS_TOKEN);
};

export const setAccessToken = (value: any) => {
  return setCookie(CookieStorageKey.ACCESS_TOKEN, value);
};

export const getRefreshToken = () => {
  return getCookie(CookieStorageKey.REFRESH_TOKEN);
};

export const setRefreshToken = (value: any) => {
  return setCookie(CookieStorageKey.REFRESH_TOKEN, value);
};

export const getRefreshTokenExpiryTime = () => {
  return getCookie(CookieStorageKey.REFRESH_TOKEN_EXPIRY_TIME);
};

export const setRefreshTokenExpiryTime = (value: any) => {
  return setCookie(CookieStorageKey.REFRESH_TOKEN_EXPIRY_TIME, value);
};

export const decodeJwt = (token: string | null) => {
  if (token === "undefined" || !token) {
    return null;
  }
  if (!token) {
    return null;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
};

export const GetDataByToken = (token: string): any | null => {
  const decoded = decodeJwt(token);
  const id = decoded?.id;
  const membername = decoded?.membername;
  const isAdmin = decoded?.isAdmin;
  const name = decoded?.name;
  return { id, name, isAdmin, membername };
};

export const rememberMe = (token: string): void => {
  setCookie(CookieStorageKey.ACCESS_TOKEN, token, 30);
};
export const isRememberMe = (): boolean => {
  return getCookie(CookieStorageKey.ACCESS_TOKEN) ? true : false;
};
