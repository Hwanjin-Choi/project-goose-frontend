import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/index";

const initialState = {
  status: "idle",
  error: null,
  keywordList: [],
};

export const getKeywordList = createAsyncThunk(
  "recommend/getKeywordList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/recommend/keywords");
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

const recommendSlice = createSlice({
  name: "recommend",
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
      .addCase(getKeywordList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getKeywordList.fulfilled, (state, action) => {
        state.status = "succeeded";
        const responseItem = action.payload.data;

        state.keywordList = [...responseItem]; // 수정된 아이템 리스트를 기존 리스트에 병합합니다.

        state.error = null;
      })
      .addCase(getKeywordList.rejected, (state) => {
        state.status = "failed";
        state.error = "키워드를 받아오는데 실패했습니다";
        state.keywordList = [];
      });
  },
});

export const { resetKeywordState } = recommendSlice.actions;

export default recommendSlice.reducer;
