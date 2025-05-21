import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nickname: "",
  accessToken: "",
  refreshToken: "",
};
const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    login: (state, action) => {
      state.nickname = action.payload.nickname;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.nickname = "";
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
});

export const { login, logout } = tokenSlice.actions;
export default tokenSlice.reducer;
