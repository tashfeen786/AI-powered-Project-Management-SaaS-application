const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = data?.detail || response.statusText || "An error occurred";
    throw new Error(error);
  }

  return data; // Expected to match StandardResponse<T> from backend
};

export const apiClient = {
  get: async (endpoint: string, options: RequestOptions = { requireAuth: true }) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.requireAuth) {
      const token = getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
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
      if (token) headers["Authorization"] = `Bearer ${token}`;
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

  patch: async (endpoint: string, body: any, options: RequestOptions = { requireAuth: true }) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.requireAuth) {
      const token = getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
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
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "DELETE",
      headers: { ...headers, ...options.headers },
    });

    return handleResponse(response);
  },
};
