import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DJANGO_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("login/", {
      email: email,
      password: password,
    });
    return response.data;
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

const authenticateUser = async () => {
  try {
    const response = await axiosInstance.get("auth/check");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { is_authenticated: false, message: error.response };
    }
    return { is_authenticated: false, message: "Unknown error" };
  }
};

const authService = { login, getUserData, authenticateUser };

export default authService;