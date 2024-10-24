import { UserLoggedIn } from "@/app/interfaces/auth/user_auth";
import axios from "axios";

// const API_URL = process.env.DJANGO_URL; // we're reading this value from .env file

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const login = async (email: string, password: string) => {
  try {
    const response: UserLoggedIn = await axiosInstance.post("login/", {
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
  }
};

const getUserData = async () => {
  try {
    const response = await axiosInstance.get(`user/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

const authService = { login, getUserData };

export default authService;
