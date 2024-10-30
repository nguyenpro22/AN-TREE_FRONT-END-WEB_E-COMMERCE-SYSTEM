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
});

export const { setAdmin, clearAdmin, setLoading, setError } =
  adminSlice.actions;
export default adminSlice.reducer;
