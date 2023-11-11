import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fold: true,
};

export const UIStore = createSlice({
  name: "uiStore",
  initialState,
  reducers: {},
});

export const { } = UIStore.actions;
export default UIStore.reducer;
