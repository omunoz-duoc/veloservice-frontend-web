import { useAuthStore } from "@/features/auth/store/auth.store";
import { getActiveSucursalId } from "@/lib/sucursales";
import { ApiError } from "./api-error";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://veloservice-backend-337hberz7q-tl.a.run.app/api/v1/";

export interface HttpRequestOptions {
  attachSucursal?: boolean;
}

function isPublicAuthEndpoint(endpoint: string): boolean {
  return endpoint === "auth/login"
    || endpoint === "auth/login_admin"
    || endpoint === "auth/reset-password"
    || endpoint === "auth/change-password";
}

function authHeader(endpoint: string): Record<string, string> {
  if (isPublicAuthEndpoint(endpoint)) return {};
  const token = useAuthStore.getState().user?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function shouldAttachSucursal(endpoint: string, options?: HttpRequestOptions): boolean {
  if (options?.attachSucursal === false) return false;
  if (endpoint.startsWith("auth")) return false;
  const user = useAuthStore.getState().user;
  return user?.ambito === "taller";
}

function getSucursalQueryParam(): string {
  const sucursalId = getActiveSucursalId();
  return sucursalId ? `sucursalId=${encodeURIComponent(sucursalId)}` : "";
}

function appendSucursalToEndpoint(endpoint: string, options?: HttpRequestOptions): string {
  if (!shouldAttachSucursal(endpoint, options)) return endpoint;
  const param = getSucursalQueryParam();
  if (!param) return endpoint;
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}${param}`;
}

function injectSucursalIntoBody(body: unknown): unknown {
  const sucursalId = getActiveSucursalId();
  if (!sucursalId) return body;
  if (typeof body === "object" && body !== null) {
    return { ...(body as Record<string, unknown>), sucursalId };
  }
  return body;
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
  get: async <T>(endpoint: string, options?: HttpRequestOptions): Promise<T> => {
    const url = appendSucursalToEndpoint(endpoint, options);
    const res = await fetch(`${apiUrl}${url}`, {
      headers: { ...authHeader(endpoint) },
    });
    await assertOk(res, `GET ${endpoint} failed`);
    return res.json() as Promise<T>;
  },
  post: async <T>(endpoint: string, body: unknown, options?: HttpRequestOptions): Promise<T> => {
    const finalBody = shouldAttachSucursal(endpoint, options) ? injectSucursalIntoBody(body) : body;
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader(endpoint) },
      body: JSON.stringify(finalBody),
    });
    await assertOk(res, `POST ${endpoint} failed`);
    return parseOptionalJson<T>(res);
  },
  put: async <T>(endpoint: string, body: unknown, options?: HttpRequestOptions): Promise<T> => {
    const finalBody = shouldAttachSucursal(endpoint, options) ? injectSucursalIntoBody(body) : body;
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader(endpoint) },
      body: JSON.stringify(finalBody),
    });
    await assertOk(res, `PUT ${endpoint} failed`);
    return res.json() as Promise<T>;
  },
  patch: async <T>(endpoint: string, body: unknown, options?: HttpRequestOptions): Promise<T> => {
    const finalBody = shouldAttachSucursal(endpoint, options) ? injectSucursalIntoBody(body) : body;
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader(endpoint) },
      body: JSON.stringify(finalBody),
    });
    await assertOk(res, `PATCH ${endpoint} failed`);
    return parseOptionalJson<T>(res);
  },
  delete: async (endpoint: string, options?: HttpRequestOptions): Promise<void> => {
    const url = appendSucursalToEndpoint(endpoint, options);
    const res = await fetch(`${apiUrl}${url}`, {
      method: "DELETE",
      headers: { ...authHeader(endpoint) },
    });
    await assertOk(res, `DELETE ${endpoint} failed`);
  },
};
