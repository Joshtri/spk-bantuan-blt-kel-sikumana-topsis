import type { AuthProvider } from "@refinedev/core";
import { axiosInstance } from "./axios";

const TOKEN_KEY = "auth_token";
const IDENTITY_CACHE_KEY = "identity_cache";
const CACHE_DURATION = 5 * 60 * 1000;

function getCachedIdentity() {
  try {
    const cached = localStorage.getItem(IDENTITY_CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(IDENTITY_CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedIdentity(data: any) {
  try {
    localStorage.setItem(
      IDENTITY_CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {}
}

function clearCachedIdentity() {
  localStorage.removeItem(IDENTITY_CACHE_KEY);
}

let identityFetchPromise: Promise<any> | null = null;

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const token = data?.data?.token ?? data?.token;

      if (!token) {
        return {
          success: false,
          error: { name: "Login Error", message: "Invalid credentials" },
        };
      }

      localStorage.setItem(TOKEN_KEY, token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return {
        success: true,
        redirectTo: "/",
        notification: {
          type: "success",
          message: "Login berhasil",
          description: "Selamat datang kembali!",
        },
      };
    } catch (error: unknown) {
      const err = error as { message?: string };
      return {
        success: false,
        error: {
          name: "Login Error",
          message: err?.message ?? "Invalid email or password",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    clearCachedIdentity();
    delete axiosInstance.defaults.headers.common["Authorization"];
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return { authenticated: false, redirectTo: "/login" };
    }

    // Decode JWT payload and check exp before making any network request
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.exp && Math.floor(Date.now() / 1000) > payload.exp) {
        localStorage.removeItem(TOKEN_KEY);
        clearCachedIdentity();
        delete axiosInstance.defaults.headers.common["Authorization"];
        return { authenticated: false, redirectTo: "/login" };
      }
    } catch {
      // Malformed token — treat as unauthenticated
      localStorage.removeItem(TOKEN_KEY);
      clearCachedIdentity();
      return { authenticated: false, redirectTo: "/login" };
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      await axiosInstance.get("/auth/me");
      return { authenticated: true };
    } catch (error: any) {
      if (error?.statusCode === 401 || error?.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        clearCachedIdentity();
        delete axiosInstance.defaults.headers.common["Authorization"];
        return { authenticated: false, redirectTo: "/login" };
      }
      return { authenticated: true };
    }
  },

  getPermissions: async () => null,

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const cached = getCachedIdentity();
    if (cached) return cached;

    if (identityFetchPromise) return identityFetchPromise;

    identityFetchPromise = (async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");
        const identity = data?.data ?? data;
        setCachedIdentity(identity);
        return identity;
      } catch {
        return null;
      } finally {
        identityFetchPromise = null;
      }
    })();

    return identityFetchPromise;
  },

  onError: async (error) => {
    if (error?.statusCode === 401) {
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },
};
