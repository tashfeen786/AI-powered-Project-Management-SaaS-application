const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Simple fetch wrapper placeholder designed around Axios architecture
// We keep it backend-agnostic and ready for FastAPI endpoints
export const apiClient = {
  get: async (endpoint: string) => {
    // Future integration: fetch(`${API_URL}${endpoint}`)
    return { data: null };
  },
  post: async (endpoint: string, data: any) => {
    return { data: null };
  },
  patch: async (endpoint: string, data: any) => {
    return { data: null };
  },
  delete: async (endpoint: string) => {
    return { data: null };
  }
};
