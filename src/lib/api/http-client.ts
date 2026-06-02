import { useAuthStore } from "@/features/auth/store/auth.store";
import { ApiError } from "./api-error";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://veloservice-backend-337hberz7q-tl.a.run.app/api/v1/";

function authHeader(endpoint: string): Record<string, string> {
  if (endpoint.startsWith("auth")) return {};
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseJsonBody(res: Response) {
  return res.json().catch(() => null);
}

async function parseOptionalJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function assertOk(res: Response, message: string) {
  if (!res.ok) {
    throw new ApiError(message, res.status, await parseJsonBody(res));
  }
}

export const httpClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      headers: { ...authHeader(endpoint) },
    });
    await assertOk(res, `GET ${endpoint} failed`);
    return res.json() as Promise<T>;
  },
  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader(endpoint) },
      body: JSON.stringify(body),
    });
    await assertOk(res, `POST ${endpoint} failed`);
    return parseOptionalJson<T>(res);
  },
  put: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader(endpoint) },
      body: JSON.stringify(body),
    });
    await assertOk(res, `PUT ${endpoint} failed`);
    return res.json() as Promise<T>;
  },
  patch: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader(endpoint) },
      body: JSON.stringify(body),
    });
    await assertOk(res, `PATCH ${endpoint} failed`);
    return parseOptionalJson<T>(res);
  },
  delete: async (endpoint: string): Promise<void> => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "DELETE",
      headers: { ...authHeader(endpoint) },
    });
    await assertOk(res, `DELETE ${endpoint} failed`);
  },
};
