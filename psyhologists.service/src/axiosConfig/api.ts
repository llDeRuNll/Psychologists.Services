// src/services/api.ts
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const ACCESS_TOKEN_KEY = "accessToken";

const BASE_URL = import.meta.env.VITE_API_URL;

export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const ls = {
  get: (key: string) => {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      if (typeof window !== "undefined") localStorage.setItem(key, value);
    } catch {
      console.error("ls set error");
    }
  },
  remove: (key: string) => {
    try {
      if (typeof window !== "undefined") localStorage.removeItem(key);
    } catch {
      console.error("ls remove error");
    }
  },
};

export const setAuthHeader = (accessToken: string) => {
  API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const clearAuthHeader = () => {
  delete API.defaults.headers.common["Authorization"];
};

export const logoutCleanup = () => {
  clearAuthHeader();
  ls.remove(ACCESS_TOKEN_KEY);
};

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = ls.get(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

API.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest) return Promise.reject(error);

    const currentToken = ls.get(ACCESS_TOKEN_KEY);

    const isUnauthorized = status === 401;
    const isRefreshing = originalRequest.url?.includes("/auth/refresh");

    if (
      isUnauthorized &&
      !originalRequest._retry &&
      !isRefreshing &&
      currentToken
    ) {
      originalRequest._retry = true;

      try {
        const resp = await API.post("/auth/refresh");

        const newAccessToken: string =
          (resp.data?.data?.accessToken as string) ??
          (resp.data?.accessToken as string);

        if (!newAccessToken)
          throw new Error("No accessToken in refresh response");

        ls.set(ACCESS_TOKEN_KEY, newAccessToken);
        setAuthHeader(newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        logoutCleanup();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
