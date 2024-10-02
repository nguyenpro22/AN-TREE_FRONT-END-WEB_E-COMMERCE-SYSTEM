import {
  authAPI,
  categoryApi,
  feedbackApi,
  orderApi,
  productApi,
  VendorAPI,
} from "@/services/apis";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [VendorAPI.reducerPath]: VendorAPI.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      productApi.middleware,
      categoryApi.middleware,
      feedbackApi.middleware,
      VendorAPI.middleware,
      orderApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
