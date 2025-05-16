import axios from "axios";
import qs from "qs";

const API_BASE_URL = import.meta.env.VITE_API_URL;
//const API_BASE_URL1 = import.meta.env.VITE_API_URL;
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

export default apiClient;
