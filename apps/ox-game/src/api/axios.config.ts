import axios, { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.set("ngrok-skip-browser-warning", 69420);
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);
