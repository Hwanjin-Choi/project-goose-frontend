import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  nickname: "",
};

const authSlicecopy = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
      state.nickname = action.payload.nickname;
    },
    logout: (state) => {
      state.username = "";
      state.nickname = "";
    },
    updateNickname: (state, action) => {
      state.nickname = action.payload;
    },
  },
});

export const { login, logout, updateNickname } = authSlicecopy.actions;
export default authSlicecopy.reducer;
