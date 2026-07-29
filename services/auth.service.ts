import { apiClient } from "./api";
import { LoginValues } from "@/features/auth/schemas/login.schema";
import { SignupValues } from "@/features/auth/schemas/signup.schema";
import { Token, UserResponse, StandardResponse } from "@/types/api";

export const AuthService = {
  login: async (data: LoginValues) => {
    // Backend expects JSON body: { email, password } via UserLogin schema
    const response: StandardResponse<Token> = await apiClient.post("/auth/login", {
      email: data.email,
      password: data.password,
    }, { requireAuth: false });

    if (typeof window !== "undefined" && response.data) {
      localStorage.setItem("token", response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
    }

    return response.data;
  },

  signup: async (data: SignupValues) => {
    // Backend expects: { email, password, full_name, organization_name }
    const response: StandardResponse<UserResponse> = await apiClient.post("/auth/register", {
      email: data.email,
      password: data.password,
      full_name: data.fullName,
      organization_name: data.organizationName,
    }, { requireAuth: false });

    return response.data;
  },

  refreshToken: async () => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    if (!refreshToken) throw new Error("No refresh token available");

    const response: StandardResponse<Token> = await apiClient.post("/auth/refresh", {
      refresh_token: refreshToken,
    }, { requireAuth: false });

    if (typeof window !== "undefined" && response.data) {
      localStorage.setItem("token", response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
    }

    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout", {});
    } catch {
      // Ignore errors — clear tokens regardless
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  },

  getCurrentUser: async (): Promise<UserResponse | null> => {
    const response: StandardResponse<UserResponse> = await apiClient.get("/auth/me");
    return response.data ?? null;
  },
};
