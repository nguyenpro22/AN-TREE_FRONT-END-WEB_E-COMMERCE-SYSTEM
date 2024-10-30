import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/types";
import { VendorAPI } from "@/services/apis/VendorAPI";

interface VendorState {
  vendor: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  vendor: null,
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendor: (state, action: PayloadAction<IUser>) => {
      state.vendor = action.payload;
    },
    clearVendor: (state) => {
      state.vendor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        VendorAPI.endpoints.getVendorProfile.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        VendorAPI.endpoints.getVendorProfile.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.vendor = action.payload.value;
        }
      )
      .addMatcher(
        VendorAPI.endpoints.getVendorProfile.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || "An error occurred";
        }
      );
  },
});

export const { setVendor, clearVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
