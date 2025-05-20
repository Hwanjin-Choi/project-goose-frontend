import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  refreshToken: "",
  isExpired: false,
  isAuthenticated: false,
};
const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isExpired = false;
    },
    logout: (state) => {
      state.accessToken = "";
      state.refreshToken = "";

      state.isExpired = true;
      state.isAuthenticated = false;
    },
    reset: (state) => {
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.isExpired = initialState.isExpired;
      state.isAuthenticated = initialState.isAuthenticated;
    },
  },
});

export const { login, logout, reset } = tokenSlice.actions;
export default tokenSlice.reducer;
