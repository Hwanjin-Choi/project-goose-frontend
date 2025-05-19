import { createSlice } from "@reduxjs/toolkit";

const initialState = { keyword: "" };

export const keywordSlice = createSlice({
  name: "keyword",
  initialState,
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
});

export const { setKeyword } = keywordSlice.actions;

export default keywordSlice.reducer;
