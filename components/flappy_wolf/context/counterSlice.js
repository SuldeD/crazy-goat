import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lives: 0,
  score: 0,
  mnft: 0,
  checks: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.score += 1;
    },
    decrement: (state) => {
      state.lives -= 1;
    },
    defineValues: (state, action) => {
      const { payload } = action;
      state.lives = payload.lives;
      state.score = payload.score;
      state.mnft = payload.mnft;
    },
    incrementByAmount: (state, action) => {
      state.score += action.payload;
    },

    replaceAmount: (state, action) => {
      const { payload } = action;
      state.score = payload.score;
      state.lives = payload.lives;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  defineValues,
  replaceAmount,
} = counterSlice.actions;

export default counterSlice.reducer;
