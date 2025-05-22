import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
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

const tokenSlicecopy = createSlice({
  name: "token",
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isExpired = false;
      state.isAuthenticated = true;
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
  extraReducers: (builder) => {
    builder
      .addCase(logoutUsingToken.fulfilled, (state) => {
        state.accessToken = "";
        state.refreshToken = "";
        state.isExpired = false;
        state.isAuthenticated = false;
      })
      .addCase(logoutUsingToken.rejected, (state) => {
        state.accessToken = "";
        state.refreshToken = "";
        state.isExpired = false;
        state.isAuthenticated = false;
      });
  },
});

export const { login, logout, reset } = tokenSlicecopy.actions;
export default tokenSlicecopy.reducer;
