import { FieldValues, UseFormReturn } from "react-hook-form";
import { HttpError } from "@refinedev/core";
import { UseFormReturnType } from "@refinedev/react-hook-form";

// Union type for supporting both Refine and regular react-hook-form
export type FormMethods<TFieldValues extends FieldValues = FieldValues> =
  | UseFormReturnType<
    TFieldValues,
    HttpError,
    TFieldValues,
    object,
    TFieldValues,
    TFieldValues,
    HttpError
  >
  | UseFormReturn<TFieldValues>;


export type SelectItemType<T = string | boolean> = {
  key: string;
  value: T;
  text?: string;
  label?: string;
  isDefault?: boolean;
  [key: string]: unknown;
};
