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
// 만료된 토큰 시 아래를 컨트롤
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
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // window.location.href = '/login';
  console.error("User logged out from interceptor due to token issues.");
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/members/refresh"
    ) {
      if (
        error.response.data?.message === "로그아웃된 토큰입니다." ||
        error.response.data?.message === "인증이 필요합니다."
      ) {
        console.warn("Token invalid.");
        handleLogoutForInterceptor();
        return Promise.reject(
          new Error(
            error.response.data?.message || "Invalid token, user logged out."
          )
        );
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            if (newAccessToken) {
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
              return apiClient(originalRequest);
            }
            return Promise.reject(
              new Error("Failed to get new access token while refreshing.")
            );
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        isRefreshing = false;
        processQueue(new Error("Refresh token not found."), null);
        handleLogoutForInterceptor();
        return Promise.reject(
          new Error("Refresh token not found. Cannot refresh.")
        );
      }

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/members/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        const { accessToken: newAccessToken } = refreshResponse.data;

        if (!newAccessToken)
          throw new Error("New access token not found in refresh response.");

        localStorage.setItem("accessToken", newAccessToken);
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogoutForInterceptor();
        const errMsg =
          refreshError.response?.data?.message ||
          refreshError.message ||
          "Failed to refresh token.";
        return Promise.reject(new Error(errMsg));
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
