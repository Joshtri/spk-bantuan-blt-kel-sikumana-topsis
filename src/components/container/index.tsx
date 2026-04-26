import { cn } from "@heroui/react";
import { type HTMLAttributes, forwardRef } from "react";
// import { cn } from "@/lib/utils"; // atau ganti dengan clsx/twMerge jika tidak pakai cn helper

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

type ContainerVariant = "default" | "centered" | "page";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Batas lebar maksimum konten.
   * @default "lg"
   */
  maxWidth?: MaxWidth;

  /**
   * Variant layout:
   * - `default`  → hanya max-width + horizontal padding
   * - `centered` → default + vertikal centering (cocok untuk auth page)
   * - `page`     → default + padding atas-bawah (cocok untuk dashboard page)
   */
  variant?: ContainerVariant;

  /** Hapus horizontal padding (berguna jika parent sudah ada padding). */
  disablePadding?: boolean;
}

// ---------------------------------------------------------------------------
// Constant maps
// ---------------------------------------------------------------------------

const maxWidthMap: Record<MaxWidth, string> = {
  sm: "max-w-sm", // 384px
  md: "max-w-md", // 448px
  lg: "max-w-4xl", // 896px
  xl: "max-w-6xl", // 1152px
  "2xl": "max-w-7xl", // 1280px
  full: "max-w-full",
};

const variantMap: Record<ContainerVariant, string> = {
  default: "mx-auto w-full",
  centered:
    "mx-auto w-full min-h-screen flex flex-col items-center justify-center",
  page: "mx-auto w-full py-8",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      maxWidth = "lg",
      variant = "default",
      disablePadding = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantMap[variant],
          maxWidthMap[maxWidth],
          !disablePadding && "px-4 sm:px-6 lg:px-8",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = "Container";
