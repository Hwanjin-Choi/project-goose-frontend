import apiClient from "../index";

export const postScrapNews = async (body) => {
  try {
    const response = await apiClient.post("/news/scrap", body);
    console.log(response);
    if (
      response.data &&
      (response.data.status === "SUCCESS" || response.status === 200)
    ) {
      return response.data;
    } else {
      throw new Error(
        response.data.message ||
          "스크랩 요청에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage = error.response.data.message;
      console.error("스크랩 실패:", errorMessage);
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error(
        "서버로부터 응답을 받지 못했습니다. 네트워크 상태를 확인해주세요."
      );
    } else {
      console.error("스크랩 요청 실패:", error);
      throw new Error("스크랩 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }
};
