import axios from "axios";

export const axiosProtected = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DJANGO_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosOpen = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DJANGO_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosProtected.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Call the Next.js API route to refresh the token
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include", // Send cookies with request
        });

        if (!refreshResponse.ok) {
          throw new Error("Failed to refresh token");
        }

        const data = await refreshResponse.json();
        const newAccessToken = data.accessToken;

        if (newAccessToken) {
          // Retry original request with new token
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosProtected(error.config);
        }
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError);
        // Redirect to login if refresh fails
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const axiosClient = async (
  endpoint: string,
  method: "GET" | "POST" | "DELETE" | "PATCH",
  data: any = null,
  params: Record<string, any> = {},
  useAuth = true
) => {
  try {
    const client = useAuth ? axiosProtected : axiosOpen;
    const config = { params };

    // URL Debugger
    // console.log(
    //   "Request URL:",
    //   `${client.defaults.baseURL}${endpoint}?${new URLSearchParams(params)}`
    // );

    let response;
    switch (method) {
      case "GET":
        response = await client.get(endpoint, config);
        break;
      case "POST":
        response = await client.post(endpoint, data, config);
        break;
      case "DELETE":
        response = await client.delete(endpoint, config);
        break;
      case "PATCH":
        response = await client.patch(endpoint, data, config);
        break;
      default:
        throw new Error("Invalid method");
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}`, error);
    throw error;
  }
};

const login = async (email: string, password: string) => {
  try {
    const response = await axiosProtected.post("auth/login/", {
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

const authService = { login };

export default authService;
