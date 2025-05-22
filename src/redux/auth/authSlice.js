import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api";

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const initialState = {
  isAuthenticated: !!accessToken,
  accessToken: accessToken,
  refreshToken: refreshToken,
  username: "",
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/members/login", credentials);
      const { accessToken, refreshToken, username } = response.data.data;

      return { accessToken, refreshToken, username };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login Failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post("/members/logout");
    } catch (error) {
      console.error(
        "Logout API call failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      dispatch(logout());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("persist:root");
    }
    return;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.username = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.username = null;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.username = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.log(action.payload);
        state.status = "failed";
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.username = null;
        state.error = action.payload || "Logout process encountered an issue.";
      });
  },
});

export const { clearAuthError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
