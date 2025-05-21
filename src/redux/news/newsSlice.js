import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/index";
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const initialState = {
  accessToken: accessToken,
  refreshToken: refreshToken,
  status: "idle",
  error: null,
  newsList: [],
  totalCount: 0,
  hasMore: true,
};

export const getNewsByParam = createAsyncThunk(
  "news/news",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/news", { params: payload });
      if (response.data && response.data.status === "SUCCESS") {
        return response.data;
      } else {
        throw new Error(response.data.message || "뉴스 검색의 실패했습니다");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login Failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    resetNewsState: (state) => {
      state.status = initialState.status;
      state.error = initialState.error;
      state.newsList = initialState.newsList; // 빈 배열로 설정됨
      state.totalCount = initialState.totalCount; // 0으로 설정됨
      state.hasMore = initialState.hasMore; // true로 설정됨
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNewsByParam.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getNewsByParam.fulfilled, (state, action) => {
        state.status = "succeeded";

        const responseItem = action.payload.data;

        state.newsList = [...state.newsList, ...responseItem.items]; // 수정된 아이템 리스트를 기존 리스트에 병합합니다.

        if (responseItem.total > state.newsList.length) {
          state.hasMore = true;
        } else {
          state.hasMore = false;
        }
        state.totalCount = responseItem.total;
        state.error = null;
      })
      .addCase(getNewsByParam.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { resetNewsState } = newsSlice.actions;

export default newsSlice.reducer;
