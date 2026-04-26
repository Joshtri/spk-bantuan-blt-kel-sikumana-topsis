import React from "react";
import { Toast } from "@heroui/react";

export const NotificationProvider = () => {
  return <Toast.Provider placement="top end" />;
};
