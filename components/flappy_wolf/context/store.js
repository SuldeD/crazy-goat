import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import gameSlice from "./gameSlice";
import modalSlice from "./modalSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    modal: modalSlice,
    game: gameSlice,
  },
});
