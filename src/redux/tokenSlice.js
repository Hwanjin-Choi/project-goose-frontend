import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/index";

const initialState = {
  nickname: "",
  accessToken: "",
  refreshToken: "",
  isAuthenticated: false,
  isExpired: false,
  status: "idle",
  error: null,
};

export const getLogin = createAsyncThunk(
  "token/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/login", { params: payload });
      if (response.data && response.data.status === "SUCCESS") {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
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
      state.isAuthenticated = false;
      state.isExpired = true;
    },
    reset: (state) => {
      state.nickname = initialState.nickname;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.isExpired = initialState.isExpired;
      state.isAuthenticated = initialState.isAuthenticated;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getLogin.fulfilled, (state, action) => {
        state.status = "succeeded";

        const responseItem = action.payload.data;

        state.nickname = responseItem.nickname;
        state.accessToken = responseItem.accessToken;
        state.refreshToken = responseItem.refreshToken;
        state.isAuthenticated = true;
        state.isExpired = false;
      })
      .addCase(getLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { login, logout, reset } = tokenSlice.actions;
export default tokenSlice.reducer;
