import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: null,
  banDuration: null,
};

export const modalSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    update: (state, action) => {
      state.stats = action.payload;
    },
    updateBan: (state, action) => {
      state.banDuration = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update, updateBan } = modalSlice.actions;

export default modalSlice.reducer;
