import { apiClient } from "./api";
import { LoginValues } from "@/features/auth/schemas/login.schema";
import { SignupValues } from "@/features/auth/schemas/signup.schema";

export const AuthService = {
  login: async (data: LoginValues) => {
    // API Contract: POST /api/v1/auth/login
    // Assuming FastAPI expects OAuth2 Password Request Form, we send FormData
    const formData = new FormData();
    formData.append("username", data.email);
    formData.append("password", data.password);
    
    const response = await apiClient.post("/auth/login", formData, { requireAuth: false });
    
    if (typeof window !== "undefined" && response.access_token) {
      localStorage.setItem("token", response.access_token);
    }
    
    return response;
  },

  signup: async (data: SignupValues) => {
    // API Contract: POST /api/v1/auth/register
    const response = await apiClient.post("/auth/register", {
      email: data.email,
      password: data.password,
      full_name: data.fullName
    }, { requireAuth: false });
    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  },

  getCurrentUser: async () => {
    // API Contract: GET /api/v1/auth/me
    const response = await apiClient.get("/auth/me");
    return response.data;
  }
};
