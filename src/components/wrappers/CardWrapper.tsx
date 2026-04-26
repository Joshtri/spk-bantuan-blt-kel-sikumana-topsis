import { Card } from "@heroui/react";
import type { ReactNode } from "react";

interface CardWrapperProps {
  /** Main content rendered inside Card.Content */
  children: ReactNode;
  /** Card title rendered as Card.Title (h3) */
  title?: ReactNode;
  /** Muted description text rendered as Card.Description */
  description?: ReactNode;
  /** Right-aligned slot in the header — use for action buttons, badges, etc. */
  headerAction?: ReactNode;
  /** Content rendered inside Card.Footer */
  footer?: ReactNode;
  /** Semantic prominence variant — default: "default" */
  variant?: "transparent" | "default" | "secondary" | "tertiary";
  /** Extra classes on the Card root */
  className?: string;
  /** Extra classes on Card.Header */
  headerClassName?: string;
  /** Extra classes on Card.Content */
  contentClassName?: string;
  /** Extra classes on Card.Footer */
  footerClassName?: string;
}

/**
 * Reusable Card layout wrapper built on HeroUI v3 Card.
 *
 * Usage:
 * ```tsx
 * <CardWrapper title="Authors" headerAction={<Button variant="primary">Add</Button>}>
 *   <DataTable ... />
 * </CardWrapper>
 * ```
 */
export const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  title,
  description,
  headerAction,
  footer,
  variant = "default",
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}) => {
  const hasHeader = title || description || headerAction;

  return (
    <Card variant={variant} className={className}>
      {hasHeader && (
        <Card.Header className={headerClassName}>
          {headerAction ? (
            <div className="flex w-full items-center justify-between gap-4">
              <div className="min-w-0">
                {title && <Card.Title>{title}</Card.Title>}
                {description && <Card.Description>{description}</Card.Description>}
              </div>
              <div className="flex shrink-0 items-center gap-2">{headerAction}</div>
            </div>
          ) : (
            <>
              {title && <Card.Title>{title}</Card.Title>}
              {description && <Card.Description>{description}</Card.Description>}
            </>
          )}
        </Card.Header>
      )}

      <Card.Content className={contentClassName}>{children}</Card.Content>

      {footer && <Card.Footer className={footerClassName}>{footer}</Card.Footer>}
    </Card>
  );
};
