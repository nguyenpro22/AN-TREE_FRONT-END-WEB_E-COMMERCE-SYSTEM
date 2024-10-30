import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILoginResponse } from "@/types";
import { authAPI } from "@/services/apis/AuthAPI";

interface AuthState {
  user: ILoginResponse | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

interface TokenData {
  id: string;
  role: string;
}
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<ILoginResponse>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authAPI.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.isAuthenticated = true;
          state.accessToken = payload.value.accessToken; // payload.value.accessToken -> payload.accessToken
          state.refreshToken = payload.value.refreshToken; // payload.value.refreshToken -> payload.refreshToken
        }
      )
      .addMatcher(
        authAPI.endpoints.refreshToken.matchFulfilled,
        (state, { payload }) => {
          state.accessToken = payload.value.accessToken; // payload.data.accessToken -> payload.accessToken
          state.refreshToken = payload.value.refreshToken; // payload.data.refreshToken -> payload.refreshToken
        }
      )
      .addMatcher(authAPI.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
