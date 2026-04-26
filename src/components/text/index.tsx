import { cn } from "@heroui/react";
import React from "react";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "small" | "label";
  size?: "xs" | "sm" | "base" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold";
  muted?: boolean;
  align?: "left" | "center" | "right";
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
  semibold: "font-semibold",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      as: Component = "p",
      size = "base",
      weight = "normal",
      muted = false,
      align = "left",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={cn(
          sizeClasses[size],
          weightClasses[weight],
          alignClasses[align],
          muted && "text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";
