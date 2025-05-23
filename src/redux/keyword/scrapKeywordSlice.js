import { createSlice } from "@reduxjs/toolkit";

const initialState = { scrapSearchText: "" };

export const scrapKeywordSlice = createSlice({
  name: "scrapKeyword",
  initialState,
  reducers: {
    setScrapKeyword: (state, action) => {
      state.scrapSearchText = action.payload;
    },
    clearScrapKeyword: (state) => {
      state.scrapSearchText = "";
    },
  },
});

export const { setScrapKeyword, clearScrapKeyword } = scrapKeywordSlice.actions;

export default scrapKeywordSlice.reducer;
