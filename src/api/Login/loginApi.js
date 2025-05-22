import apiClient from "../index";
import axios from "axios";

export const login = async (userData) => {
  const loginresponse = await apiClient.post("/members/login", userData);
  console.log("userinfo", loginresponse.data.data.userInfo);
  console.log("tokeninfo", loginresponse.data.data.tokenInfo);

  return loginresponse;
};
