import { Spinner } from "@heroui/react";
import React from "react";

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background/50  animate-in fade-in duration-300">
      <Spinner size="xl" color="accent" />
    </div>
  );
};

export default LoadingScreen;
