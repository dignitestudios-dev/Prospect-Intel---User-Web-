import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./feature/authSlice";
import activityMiddleware from "./middleware/activityMiddleware";

const rootReducer = combineReducers({
  auth: authSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(activityMiddleware),
});
