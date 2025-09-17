 // src/api.js
import axiosInstance from "./axiosInstance";

export const apiRequest = async (
  endpoint,
  method = "POST",
  payload = {},
  query = {},   // ✅ support query params
  headers = {}
) => {
  try {
    const response = await axiosInstance({
      url: `/${endpoint}`,
      method,
      params: query,   // ✅ dynamic query params (?skip=0&limit=10)
      data: payload,   // ✅ dynamic body
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
