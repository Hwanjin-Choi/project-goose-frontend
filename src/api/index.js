import axios from "axios";
import qs from "qs";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// --- 요청 인터셉터 ---
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogoutForInterceptor = () => {
  /*   localStorage.removeItem("accessToken"); // 활성화
  localStorage.removeItem("refreshToken"); // 활성화 */
  // 필요시 로그인 페이지로 리디렉션
  // window.location.href = '/login';
  console.error("User logged out from interceptor due to token issues.");
  // 추가적인 전역 로그아웃 처리 또는 상태 초기화 로직이 필요할 수 있습니다.
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(originalRequest, "hi");
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/members/refresh" // 재발급 요청 자체는 인터셉트하지 않음
    ) {
      if (error.response.data?.message === "로그아웃된 토큰입니다.") {
        console.warn(
          "Token invalid, performing logout:",
          error.response.data.message
        );
        handleLogoutForInterceptor();
        return Promise.reject(
          new Error(
            error.response.data?.message || "Invalid token, user logged out."
          )
        );
      }

      // 현재 토큰 재발급 중인 경우, 요청을 큐에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest); // 새 토큰으로 원래 요청 재시도
          })
          .catch((err) => {
            return Promise.reject(err); // 큐 처리 중 오류 발생 시 전파
          });
      }

      originalRequest._retry = true; // 재시도 플래그 설정
      isRefreshing = true; // 토큰 재발급 상태로 변경
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        isRefreshing = false;
        processQueue(new Error("Refresh token not found."), null); // 큐에 있는 요청들 실패 처리
        handleLogoutForInterceptor();
        return Promise.reject(
          new Error("Refresh token not found. Cannot refresh.")
        );
      }

      try {
        console.log("Attempting to refresh token...");
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/members/refresh`,
          { refreshToken }, // 백엔드가 기대하는 페이로드 확인 필요
          { headers: { "Content-Type": "application/json" } }
        );

        const responseData = refreshResponse.data;
        // console.log("Refresh response received:", responseData); // 디버깅용 로그

        if (responseData && responseData.accessToken) {
          const newAccessToken = responseData.accessToken;
          console.log("New access token obtained:", newAccessToken);
          localStorage.setItem("accessToken", newAccessToken);
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken); // 큐에 있는 요청들 성공 처리 (새 토큰 전달)
          return apiClient(originalRequest); // 원래 요청 재시도
        } else {
          console.error(
            "New access token not found in refresh response:",
            responseData
          );
          throw new Error(
            "New access token not found or invalid response from refresh API."
          );
        }
      } catch (refreshError) {
        console.error(
          "Failed to refresh token:",
          refreshError.response?.data || refreshError.message
        );
        processQueue(refreshError, null); // 큐에 있는 요청들 실패 처리
        handleLogoutForInterceptor(); // 재발급 실패 시 로그아웃
        const errMsg =
          refreshError.response?.data?.message ||
          refreshError.message ||
          "Failed to refresh token.";
        return Promise.reject(new Error(errMsg));
      } finally {
        isRefreshing = false; // 토큰 재발급 상태 해제
      }
    }
    return Promise.reject(error); // 401이 아니거나 재시도 조건에 맞지 않는 경우 오류 그대로 반환
  }
);

export default apiClient;
