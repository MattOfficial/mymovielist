import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import movieReducer from "./slices/movieSlice";
import listReducer from "./slices/listSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    lists: listReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
