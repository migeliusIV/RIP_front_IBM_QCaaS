import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./slices/filtersSlice";
import gatesReducer from "./slices/gatesSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    gates: gatesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;