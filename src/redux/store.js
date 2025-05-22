import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
// localStorage 저장
import storage from "redux-persist/lib/storage";

//slice 파일들
import keywordSlice from "./keyword/keywordSlice";
import newsSlice from "./news/newsSlice";
import registrationSlice from "./registration/registrationSlice";
import tokenSlice from "./token/tokenSlice";
import recommendSlice from "./recommend/recommendSlice";
import trendingSlice from "./trending/trendingSlice";

// 여러 리듀서를 합치는 경우 (지금은 하나지만 확장성 고려)
const rootReducer = combineReducers({
  keyword: keywordSlice,
  news: newsSlice,
  registration: registrationSlice,
  token: tokenSlice,
  recommend: recommendSlice,
  trending: trendingSlice,
});

// persist 설정
const persistConfig = {
  key: "root",
  storage,
};

// persist reducer 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store 생성
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist 관련 경고 제거
    }),
});

// persistor 생성
export const persistor = persistStore(store);
