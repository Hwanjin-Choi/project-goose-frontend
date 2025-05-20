import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  pwd: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.pwd = action.payload.pwd;
    },
    logout: (state) => {
      state.id = "";
      state.pwd = "";
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
