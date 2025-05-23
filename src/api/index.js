import axios from "axios";
import qs from "qs";
import { store } from "../redux/store"; // Redux 스토어를 직접 import 합니다.
import { login, logout } from "../redux/token/tokenSlice";

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
    const accessToken = store.getState().token.accessToken; // 스토어에서 직접 accessToken 가져오기
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
  store.dispatch(logout());
  window.location.href = "/expired-page";
  console.error("User logged out from interceptor due to token issues.");
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const currentRefreshToken = store.getState().token.refreshToken;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/members/refresh"
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

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (!currentRefreshToken) {
        isRefreshing = false;
        processQueue(new Error("Refresh token not found."), null);
        handleLogoutForInterceptor();
        return Promise.reject(
          new Error("Refresh token not found. Cannot refresh.")
        );
      }

      try {
        console.log("Attempting to refresh token...");
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/members/refresh`,
          { refreshToken: currentRefreshToken }, // 스토어에서 가져온 refreshToken 사용
          { headers: { "Content-Type": "application/json" } }
        );

        const responseData = refreshResponse.data;

        if (responseData && responseData.accessToken) {
          const newAccessToken = responseData.accessToken;
          console.log("New access token obtained:", newAccessToken);
          // 스토어의 dispatch 사용
          store.dispatch(
            login({
              accessToken: newAccessToken,
              refreshToken: currentRefreshToken,
            }) // refreshToken도 함께 업데이트하거나, 기존 값 유지
          );
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
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
