// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// localStorage 저장
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice"; // 슬라이스에서 default로 export한 reducer
import keywordSlice from "./keyword/keywordSlice";
import { combineReducers } from "redux";

// 여러 리듀서를 합치는 경우 (지금은 하나지만 확장성 고려)
const rootReducer = combineReducers({
  user: userReducer,
  keyword: keywordSlice,
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
