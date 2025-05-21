import apiClient from "../index";
import axios from "axios";

export const login = async (userData) => {
  const loginresponse = await apiClient.post("/members/login", userData);
  console.log(loginresponse, "axios calling");

  return loginresponse;
};
