import { configureStore } from "@reduxjs/toolkit";
import { shubhamDevApi } from "./features/shubamdevApi";
import { adminApi } from "./features/adminApi";
import { homePageApi } from "./features/homePageApi";

export const store = configureStore({
  reducer: {
    [shubhamDevApi.reducerPath]: shubhamDevApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [homePageApi.reducerPath]: homePageApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(shubhamDevApi.middleware)
      .concat(adminApi.middleware)
      .concat(homePageApi.middleware),
});