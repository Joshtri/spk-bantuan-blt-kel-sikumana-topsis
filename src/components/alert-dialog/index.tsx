"use client";

import React from "react";
import { AlertDialog as HeroAlertDialog, Button } from "@heroui/react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "danger";

type AlertStatus = "default" | "accent" | "success" | "warning" | "danger";

interface AlertDialogProps {
  triggerLabel: string;
  triggerContent?: React.ReactNode;
  triggerIsIconOnly?: boolean;
  triggerAriaLabel?: string;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  triggerVariant?: ButtonVariant;
  confirmVariant?: ButtonVariant;
  cancelVariant?: ButtonVariant;
  status?: AlertStatus;
  isDisabled?: boolean;
}

export function AlertDialog({
  triggerLabel,
  triggerContent,
  triggerIsIconOnly = false,
  triggerAriaLabel,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  triggerVariant = "danger",
  confirmVariant = "danger",
  cancelVariant = "tertiary",
  status = "danger",
  isDisabled = false,
}: AlertDialogProps) {
  const handleConfirm = async (close: () => void) => {
    await onConfirm?.();
    close();
  };

  return (
    <HeroAlertDialog>
      <Button
        variant={triggerVariant}
        isDisabled={isDisabled}
        size="sm"
        isIconOnly={triggerIsIconOnly}
        aria-label={triggerAriaLabel}
      >
        {triggerContent ?? triggerLabel}
      </Button>
      <HeroAlertDialog.Backdrop>
        <HeroAlertDialog.Container>
          <HeroAlertDialog.Dialog className="sm:max-w-100px">
            {({ close }) => (
              <>
                <HeroAlertDialog.CloseTrigger />
                <HeroAlertDialog.Header>
                  <HeroAlertDialog.Icon status={status} />
                  <HeroAlertDialog.Heading>{title}</HeroAlertDialog.Heading>
                </HeroAlertDialog.Header>
                {description ? (
                  <HeroAlertDialog.Body>
                    {typeof description === "string" ? (
                      <p>{description}</p>
                    ) : (
                      description
                    )}
                  </HeroAlertDialog.Body>
                ) : null}
                <HeroAlertDialog.Footer>
                  <Button slot="close" variant={cancelVariant}>
                    {cancelLabel}
                  </Button>
                  <Button
                    variant={confirmVariant}
                    onPress={() => handleConfirm(close)}
                  >
                    {confirmLabel}
                  </Button>
                </HeroAlertDialog.Footer>
              </>
            )}
          </HeroAlertDialog.Dialog>
        </HeroAlertDialog.Container>
      </HeroAlertDialog.Backdrop>
    </HeroAlertDialog>
  );
}
