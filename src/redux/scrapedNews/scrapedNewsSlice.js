import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/index";
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const initialState = {
  accessToken: accessToken,
  refreshToken: refreshToken,
  status: "idle",
  error: null,
  scrapedNewsList: [],
  totalCount: 0,
  hasMore: true,
};

export const getScrapedNewsByParam = createAsyncThunk(
  "news/scrapedNews",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/news/Scrap", { params: payload });
      if (response.data && response.data.status === "SUCCESS") {
        return response.data;
      } else {
        throw new Error(
          response.data.message || "스크랩된 뉴스를 불러오는데 실패했습니다"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login Failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const scrapedNewsSlice = createSlice({
  name: "scrapedNews",
  initialState,
  reducers: {
    resetScrapedNewsState: (state) => {
      state.status = initialState.status;
      state.error = initialState.error;
      state.scrapedNewsList = initialState.scrapedNewsList; // 빈 배열로 설정됨
      state.totalCount = initialState.totalCount; // 0으로 설정됨
      state.hasMore = initialState.hasMore; // true로 설정됨
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getScrapedNewsByParam.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getScrapedNewsByParam.fulfilled, (state, action) => {
        state.status = "succeeded";

        const responseItem = action.payload.data;

        state.scrapedNewsList = [
          ...state.scrapedNewsList,
          ...responseItem.content,
        ]; // 수정된 아이템 리스트를 기존 리스트에 병합합니다.

        if (responseItem.total > state.scrapedNewsList.length) {
          state.hasMore = true;
        } else {
          state.hasMore = false;
        }
        state.totalCount = responseItem.total;
        state.error = null;
      })
      .addCase(getScrapedNewsByParam.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { resetScrapedNewsState } = scrapedNewsSlice.actions;

export default scrapedNewsSlice.reducer;
