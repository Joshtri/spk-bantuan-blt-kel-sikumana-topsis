import type { ReactNode } from "react";
import type { FormControllerProps } from "../form/FormController";

export interface BaseInputProps extends Omit<
  FormControllerProps,
  "defaultValue" | "isRequired" | "render"
> {
  isRequired?: boolean;
  isDisabled?: boolean;
  bottomContent?: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  hideLabel?: boolean;
}
