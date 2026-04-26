import type { AuthProvider } from "@refinedev/core";
import { axiosInstance } from "./axios";

const TOKEN_KEY = "auth_token";

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
    delete axiosInstance.defaults.headers.common["Authorization"];
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  getPermissions: async () => null,

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      const { data } = await axiosInstance.get("/auth/me");
      return data?.data ?? data;
    } catch {
      return null;
    }
  },

  onError: async (error) => {
    if (error?.statusCode === 401) {
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },
};
