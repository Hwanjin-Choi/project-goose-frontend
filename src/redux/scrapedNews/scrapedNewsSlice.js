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
      console.log("요청 보내기");
      const response = await apiClient.get("/news/scrap", { params: payload });

      if (response.data) {
        console.log(response.data);
        return response.data; // 그대로 content, pageable 등을 넘겨줌
      } else {
        throw new Error("스크랩된 뉴스를 불러오는데 실패했습니다");
      }
    } catch (e) {
      const errorMessage =
        e.response?.data?.message || e.message || "스크랩된 뉴스 요청 실패";
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

        const responseItem = action.payload;

        state.scrapedNewsList = [
          ...state.scrapedNewsList,
          ...responseItem.content,
        ];

        state.totalCount = responseItem.totalElements;

        state.hasMore = !responseItem.last;

        state.error = null;
      })
      .addCase(getScrapedNewsByParam.rejected, (state, action) => {
        console.error("스크랩 뉴스 API 에러:", error);

        state.status = "failed";
        state.error = action.payload || "스크랩 뉴스 로딩 실패";
      });
  },
});

export const { resetScrapedNewsState } = scrapedNewsSlice.actions;

export default scrapedNewsSlice.reducer;
