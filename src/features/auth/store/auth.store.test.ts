import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";
import type { User } from "@/features/auth/services/auth.service";

const mockUser: User = {
  nombre: "Ana",
  apellido: "Lopez",
  rol: "Mecanico Sr",
};

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    hasHydrated: false,
  });
});

describe("useAuthStore", () => {
  it("starts with no user", () => {
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("setUser stores user and clears error", () => {
    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("setSession stores user and token", () => {
    useAuthStore.getState().setSession(mockUser, "jwt-token");
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe("jwt-token");
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("setError stores message and clears loading", () => {
    useAuthStore.getState().setError("Credenciales incorrectas");
    const state = useAuthStore.getState();
    expect(state.error).toBe("Credenciales incorrectas");
    expect(state.isLoading).toBe(false);
  });

  it("logout clears user, token and error", () => {
    useAuthStore.setState({ user: mockUser, token: "jwt-token" });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().error).toBeNull();
  });

  it("setLoading updates isLoading", () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });
});
