import { useAuthStore } from "@/features/auth/store/auth.store";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/";

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().token;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
}

export const httpClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    console.log(`HTTP GET ${apiUrl}${endpoint}`);
    const res = await fetch(`${apiUrl}${endpoint}`, {
      headers: authHeaders(),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw { status: res.status, message: `GET ${endpoint} failed`, body: errorBody };
    }
    return res.json() as Promise<T>;
  },
  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw { status: res.status, message: `POST ${endpoint} failed`, body: errorBody };
    }
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
  },
  put: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw { status: res.status, message: `PUT ${endpoint} failed`, body: errorBody };
    }
    return res.json() as Promise<T>;
  },
  delete: async (endpoint: string): Promise<void> => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw { status: res.status, message: `DELETE ${endpoint} failed`, body: errorBody };
    }
  },
};
