import type { FieldErrors } from "react-hook-form";

export const toEachCapitalize = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/** Resolves dot-notation paths like "address.street" in RHF's errors object. */
export function getFieldError(errors: FieldErrors, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = errors;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  if (current == null || typeof current !== "object") return undefined;
  return (current as { message?: unknown }).message as string | undefined;
}
