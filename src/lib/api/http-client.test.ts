import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient, __getAuthTokenForTest } from "./http-client";
import { useAuthStore } from "@/features/auth/store/auth.store";

function mockResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

describe("httpClient auth headers", () => {
  const fetchSpy = vi.fn();

  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: false, error: null });
    window.localStorage.clear();
    fetchSpy.mockReset();
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads the token from Zustand persist state.user.token", async () => {
    window.localStorage.setItem(
      "vs-auth",
      JSON.stringify({
        state: {
          user: {
            token: "persisted-token",
          },
        },
      })
    );

    fetchSpy.mockResolvedValueOnce(mockResponse({ ok: true }));

    await httpClient.get("ordenes");

    expect(__getAuthTokenForTest()).toBe("persisted-token");
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/ordenes"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer persisted-token",
        }),
      })
    );
  });

  it("does not attach Authorization to auth endpoints", async () => {
    useAuthStore.setState({
      user: {
        nombre: "Ana",
        apellido: "López",
        token: "persisted-token",
        rol: "admin_taller",
        ambito: "taller",
        tallerId: "T-001",
        sucursalId: null,
      },
      isLoading: false,
      error: null,
    });

    fetchSpy.mockResolvedValueOnce(mockResponse({ ok: true }));

    await httpClient.post("auth/login", { email: "ana@example.com", password: "secret" });

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth/login"),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      })
    );
  });
});
