import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api";
const initialState = {
  nickname: "",
  accessToken: "",
  refreshToken: "",
  isExpired: false,
  isAuthenticated: false,
};

export const logoutUsingToken = createAsyncThunk(
  "token/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/members/logout");
      if (response.data && response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message || "로그인 실패");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login Failed";
      return rejectWithValue(errorMessage);
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(logoutUsingToken.fulfilled, (state) => {
        state.nickname = "";
        state.accessToken = "";
        state.refreshToken = "";
        state.isExpired = false;
        state.isAuthenticated = false;
      })
      .addCase(logoutUsingToken.rejected, (state) => {
        state.nickname = "";
        state.accessToken = "";
        state.refreshToken = "";
        state.isExpired = false;
        state.isAuthenticated = false;
      });
  },
});

export const { login, logout, reset, updateNickname } = tokenSlice.actions;
export default tokenSlice.reducer;
