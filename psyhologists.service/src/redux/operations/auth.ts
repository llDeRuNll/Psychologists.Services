import { createAsyncThunk } from "@reduxjs/toolkit";
import { API, clearAuthHeader, setAuthHeader } from "../../axiosConfig/api.ts";

export type Role = "client" | "psychologist";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
}

export interface TokensResponse {
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const login = createAsyncThunk<
  TokensResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (body, { rejectWithValue }) => {
  try {
    const { data } = await API.post<TokensResponse>("/auth/login", body);
    setAuthHeader(data.accessToken);
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  } catch (e: unknown) {
    return rejectWithValue(e instanceof Error ? e.message : "Login failed");
  }
});

export const register = createAsyncThunk<
  TokensResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (body, { rejectWithValue }) => {
  try {
    const { data } = await API.post<TokensResponse>("/auth/register", body);
    setAuthHeader(data.accessToken);
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  } catch {
    return rejectWithValue("Registration failed");
  }
});

export const refresh = createAsyncThunk<
  TokensResponse,
  void,
  { rejectValue: string }
>("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.post<TokensResponse>("/auth/refresh");
    setAuthHeader(data.accessToken);
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  } catch {
    return rejectWithValue("Session is invalid");
  }
});

export const getMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<User>("/auth/me");
      return data;
    } catch {
      return rejectWithValue("not possible to get user data");
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.post("/auth/logout");
    } catch {
      return rejectWithValue("error");
    } finally {
      clearAuthHeader();
      localStorage.removeItem("accessToken");
    }
  }
);
