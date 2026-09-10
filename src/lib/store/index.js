import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./feature/authSlice";
import filterSlice from "./feature/filterSlice";
import activityMiddleware from "./middleware/activityMiddleware";

const rootReducer = combineReducers({
  auth: authSlice,
  filters: filterSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(activityMiddleware),
});
