import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = { name: "", age: null, email: "" };

export const userSlice = createSlice({
  name: "user",
  initialState: { value: initialStateValue },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      // 빈 배열로 변경하기
      state.value = initialStateValue;

      // 로컬스토리지 다 날리기
      // persistor.purge();
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
