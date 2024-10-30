import {
  authAPI,
  categoryApi,
  feedbackApi,
  orderApi,
  productApi,
  VendorAPI,
  productDiscountApi,
  adminAPI,
} from "@/services/apis";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import vendorReducer from "@/redux/store/slices/vendorSlice";
import adminReducer from "@/redux/store/slices/adminSlice";
const store = configureStore({
  reducer: {
    admin: adminReducer,
    [adminAPI.reducerPath]: adminAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    vendor: vendorReducer,
    [VendorAPI.reducerPath]: VendorAPI.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [productDiscountApi.reducerPath]: productDiscountApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminAPI.middleware,
      authAPI.middleware,
      productApi.middleware,
      categoryApi.middleware,
      feedbackApi.middleware,
      VendorAPI.middleware,
      orderApi.middleware,
      productDiscountApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
