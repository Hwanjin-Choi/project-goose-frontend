import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nickname: "",
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
      state.nickname = action.payload.nickname;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isExpired = false;
    },
    logout: (state) => {
      state.nickname = "";
      state.accessToken = "";
      state.refreshToken = "";
      state.isExpired = true;
      state.isAuthenticated = false;
    },
    reset: (state) => {
      state.nickname = initialState.nickname;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.isExpired = initialState.isExpired;
      state.isAuthenticated = initialState.isAuthenticated;
    },
    updateNickname: (state, action) => {
      state.nickname = action.payload;
    },
  },
});

export const { login, logout, reset, updateNickname } = tokenSlice.actions;
export default tokenSlice.reducer;
