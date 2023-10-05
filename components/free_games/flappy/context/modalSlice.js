import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  infoModal: false,
  loginModal: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    triggerModal: (state, action) => {
      state.isOpen = action.payload;
    },

    triggerInfo: (state, action) => {
      state.infoModal = action.payload;
    },

    triggerLogin: (state, action) => {
      state.loginModal = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { triggerModal, triggerInfo, triggerLogin } = modalSlice.actions;

export default modalSlice.reducer;
