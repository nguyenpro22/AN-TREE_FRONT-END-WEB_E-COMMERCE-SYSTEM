import { adminAPI } from "@/services/apis";
import { IAdmin } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  admin: IAdmin | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admin: null,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<IAdmin>) => {
      state.admin = action.payload;
    },
    clearAdmin: (state) => {
      state.admin = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(adminAPI.endpoints.getAdminProfile.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        adminAPI.endpoints.getAdminProfile.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.admin = action.payload.value;
        }
      )
      .addMatcher(
        adminAPI.endpoints.getAdminProfile.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || "An error occurred";
        }
      );
  },
});

export const { setAdmin, clearAdmin, setLoading, setError } =
  adminSlice.actions;
export default adminSlice.reducer;
