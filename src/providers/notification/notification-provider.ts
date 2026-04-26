"use client";

import type { NotificationProvider } from "@refinedev/core";
import { toast } from "@heroui/react";

type NotificationKey = string | number;
type ToastId = string | number;

const keyToToastId = new Map<NotificationKey, ToastId>();

const resolveVariant = (type?: "success" | "error" | "progress" | "info") => {
  if (type === "success") return "success";
  if (type === "error") return "danger";
  if (type === "progress") return "warning";
  return "default";
};

export const notificationProvider: NotificationProvider = {
  open: ({ key, message, type, description }) => {
    const toastId = toast(String(message ?? ""), {
      description,
      variant: resolveVariant(type),
      actionProps: {
        // children: "Dismiss",
        // onPress: () => toast.clear(),
        variant: "tertiary",
      },
    });

    if (key !== undefined && key !== null) {
      keyToToastId.set(key as NotificationKey, toastId);
      return key;
    }

    return toastId;
  },

  close: (key) => {
    if (key !== undefined && key !== null) {
      const mappedToastId = keyToToastId.get(key as NotificationKey);

      if (mappedToastId !== undefined) {
        // HeroUI v3 toast API may expose close(id) depending on build.
        // Fallback to clear() if close is unavailable.
        toast.clear();
        keyToToastId.delete(key as NotificationKey);
        return;
      }
    }

    toast.clear();
  },
};
