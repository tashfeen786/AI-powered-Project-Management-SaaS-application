import { StandardResponse } from "@/types/api";

// Determine API URL based on environment or browser context
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    // If accessed via a local network IP, point to that IP's port 8000
    return `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;
  }
  return "http://localhost:8000/api/v1";
};

const API_URL = getApiUrl();

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Attempt token refresh before redirecting
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.data?.access_token) {
            localStorage.setItem("token", refreshData.data.access_token);
            if (refreshData.data.refresh_token) {
              localStorage.setItem("refresh_token", refreshData.data.refresh_token);
            }
            // Caller should retry — for now we still throw so React Query can retry
          }
        }
      } catch {
        // Refresh failed — clear tokens and redirect
      }
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Handle 422 validation errors specifically
    if (response.status === 422 && data?.data) {
      const validationErrors = data.data
        .map((err: any) => err.msg)
        .join(", ");
      throw new Error(validationErrors || "Validation Error");
    }

    const error = data?.detail || data?.message || response.statusText || "An error occurred";
    const apiError = new Error(error);
    (apiError as any).status = response.status;
    (apiError as any).data = data;
    throw apiError;
  }

  return data; // StandardResponse<T> from backend
};

/**
 * Build query string from params object, ignoring null/undefined values.
 */
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const apiClient = {
  get: async (endpoint: string, params?: Record<string, any>, options: RequestOptions = { requireAuth: true }) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.requireAuth) {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Unauthorized: No token found");
      }
    }

    const response = await fetch(`${API_URL}${endpoint}${buildQueryString(params)}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    return handleResponse(response);
  },

  post: async (endpoint: string, body: any, options: RequestOptions = { requireAuth: true }) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.requireAuth) {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Unauthorized: No token found");
      }
    }

    // Special case for FormData (file uploads)
    if (body instanceof FormData) {
      delete headers["Content-Type"]; // Let browser set boundary
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "POST",
      headers: { ...headers, ...options.headers },
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    return handleResponse(response);
  },

  put: async (endpoint: string, body: any, options: RequestOptions = { requireAuth: true }) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.requireAuth) {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Unauthorized: No token found");
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "PUT",
      headers: { ...headers, ...options.headers },
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  patch: async (endpoint: string, body: any, options: RequestOptions = { requireAuth: true }) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.requireAuth) {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Unauthorized: No token found");
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "PATCH",
      headers: { ...headers, ...options.headers },
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  delete: async (endpoint: string, options: RequestOptions = { requireAuth: true }) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.requireAuth) {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Unauthorized: No token found");
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "DELETE",
      headers: { ...headers, ...options.headers },
    });

    return handleResponse(response);
  },
};
