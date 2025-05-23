import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/index";

const initialState = {
  status: "idle",
  error: null,
  keywordList: [],
};

export const getTrendingKeywordList = createAsyncThunk(
  "trending/getTrendingKeywordList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/trending/keywords");
      console.log(response);
      if (response.data && response.data.status === "SUCCESS") {
        return response.data;
      } else {
        throw new Error(response.data.message || "키워드 검색에 성공했습니다");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "키워드 실패";
      return rejectWithValue(errorMessage);
    }
  }
);

const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    resetKeywordState: (state) => {
      state.status = "idle";
      state.error = null;
      state.keywordList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrendingKeywordList.pending, (state) => {
        state.status = "loading";
        state.keywordList = [];
        state.error = null;
      })
      .addCase(getTrendingKeywordList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const topKeywords = action.payload.data.top_keywords;

        if (Array.isArray(topKeywords)) {
          if (topKeywords.length > 30) {
            const sortedAndSlicedKeywords = [...topKeywords]
              .sort((a, b) => {
                // count 값이 숫자가 아닐 경우를 대비하여 Number로 변환
                const countA = Number(a.count) || 0;
                const countB = Number(b.count) || 0;
                return countB - countA; // 내림차순 정렬
              })
              .slice(0, 30); // 상위 30개 아이템 선택
            state.keywordList = sortedAndSlicedKeywords;
          } else {
            // 30개 이하일 경우, 전체 리스트를 그대로 사용
            state.keywordList = topKeywords;
          }
        } else {
          // topKeywords가 배열이 아니거나 존재하지 않는 경우에 대한 처리
          console.error(
            "Error: top_keywords in payload is not an array or is missing.",
            action.payload
          );
          state.keywordList = []; // 빈 배열로 설정하거나 다른 적절한 오류 처리
          state.status = "failed"; // 데이터 형식이 잘못되었으므로 실패 상태로 변경
          state.error = "수신된 키워드 데이터 형식이 올바르지 않습니다.";
        }
      })
      .addCase(getTrendingKeywordList.rejected, (state) => {
        state.status = "failed";
        state.error = "키워드를 받아오는데 실패했습니다";
        state.keywordList = [];
      });
  },
});

export const { resetKeywordState } = trendingSlice.actions;

export default trendingSlice.reducer;
