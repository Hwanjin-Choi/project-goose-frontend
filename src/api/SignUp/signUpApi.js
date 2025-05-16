import apiClient from "../index";

export const SignUp = async ({ username, password }) => {
  try {
    const response = await apiClient.post("/register", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("SignUp error:", error);
    throw new Error("회원가입 요청 실패");
  }
};
