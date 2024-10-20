import type { AxiosInstance } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Django API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  // Provide the Axios instance globally
  nuxtApp.provide("axios", api);
});
