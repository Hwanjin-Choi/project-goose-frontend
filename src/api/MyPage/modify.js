import apiClient from "../index";

export const modifyInfo = async ({
  currentPassword,
  newPassword,
  nickname,
}) => {
  try {
    const response = await apiClient.post("/mypage/modify", {
      currentPassword,
      newPassword,
      nickname,
    });

    if (
      response.data &&
      (response.data.status === "SUCCESS" || response.status === 200)
    ) {
      console.log("회원정보 수정 성공!", response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "수정 실패");
    }
  } catch (error) {
    if (error.response) {
      const message =
        error.response.data ||
        error.response.data?.message ||
        "요청 처리 중 오류가 발생했습니다.";
      console.error("회원정보 수정 실패:", message);
      throw new Error(message);
    } else if (error.request) {
      console.error("회원정보 수정 실패: 서버 응답 없음");
      throw new Error("서버로부터 응답이 없습니다.");
    } else {
      console.error("회원정보 수정 실패:", error.message);
      throw new Error(error.message || "알 수 없는 에러가 발생했습니다.");
    }
  }
};
