// src/api/SignUp/signUpApi.js
import apiClient from "../index";

export const SignUp = async ({ username, password, nickname }) => {
  try {
    const response = await apiClient.post("/register", {
      username,
      password,
      nickname,
      admin,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage = error.response.data.error;
      console.error("회원가입 실패:", errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error("회원가입 요청 실패:", error);
      throw new Error(
        "회원가입 요청에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }
};
