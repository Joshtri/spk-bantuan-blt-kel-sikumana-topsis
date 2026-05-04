import axios from "axios";
import type { AxiosError } from "axios";
import type { HttpError } from "@refinedev/core";
import { API_URL } from "./constants";
import type { ApiErrorResponse } from "../interfaces/IBaseEntity";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Converts a PascalCase or dotted key to camelCase so it matches RHF field names.
 * e.g. "Nik" → "nik", "FullName" → "fullName", "Address.Street" → "address.street"
 */
function toCamelCase(key: string): string {
  return key
    .split(".")
    .map((part) => part.charAt(0).toLowerCase() + part.slice(1))
    .join(".");
}

/**
 * Normalises backend validation errors into the flat Record<string, string>
 * that Refine's useForm expects so it can call setError() for each field.
 *
 * Handles two backend shapes:
 *   - Legacy `fields`: Record<string, string>  (already flat, already camelCase)
 *   - .NET FluentValidation `errors`: Record<string, string[]>  (PascalCase, array)
 */
function extractFieldErrors(
  data: ApiErrorResponse | undefined,
): Record<string, string> | undefined {
  if (!data) return undefined;

  if (data.errors && Object.keys(data.errors).length > 0) {
    return Object.fromEntries(
      Object.entries(data.errors).map(([key, messages]) => [
        toCamelCase(key),
        Array.isArray(messages) ? messages[0] : String(messages),
      ]),
    );
  }

  if (data.fields && Object.keys(data.fields).length > 0) {
    return data.fields;
  }

  return undefined;
}

// Convert Axios errors into Refine's HttpError shape so the notification
// provider and useForm error handling work out of the box.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;

    // Auto-logout on any 401 outside the login endpoint
    if (status === 401) {
      const url = error.config?.url ?? "";
      if (!url.includes("/auth/login")) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("identity_cache");
        delete axiosInstance.defaults.headers.common["Authorization"];
        window.location.href = "/login";
      }
    }

    const data = error.response?.data;
    const fieldErrors = extractFieldErrors(data);

    const httpError: HttpError = {
      message:
        data?.error ?? data?.message ?? error.message ?? "An error occurred",
      statusCode: status ?? 0,
      ...(fieldErrors ? { errors: fieldErrors } : {}),
    };

    return Promise.reject(httpError);
  },
);
