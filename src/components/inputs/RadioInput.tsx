import type { ReactNode } from "react";
import {
  cn,
  Description,
  FieldError,
  Label,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { getFieldError, toEachCapitalize } from "@/utils/common";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { useFormMode } from "@/contexts/FormModeContext";

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  isDisabled?: boolean;
}

interface RadioInputProps extends BaseInputProps {
  options: RadioOption[];
  /** "default" = standard inline radio list. "card" = each option renders as a selectable card tile. */
  variant?: "default" | "card";
  /** Orientation for default variant only. */
  orientation?: "horizontal" | "vertical";
  /** Number of columns for card variant grid (default 2). */
  cols?: 1 | 2 | 3 | 4;
}

const colsClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export const RadioInput: React.FC<RadioInputProps> = ({
  fieldName,
  fieldLabel,
  requiredMessage,
  isRequired = false,
  isDisabled = false,
  description,
  options,
  variant = "default",
  orientation = "horizontal",
  cols = 2,
  additionalRules,
}) => {
  const { isShow } = useFormMode();
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={labelText}
      requiredMessage={requiredMessage}
      additionalRules={additionalRules}
      render={({ errors, value, onChange }) => {
        const fieldError = getFieldError(errors, fieldName);

        return (
          <div className="mt-4">
            <RadioGroup
              value={value as string}
              onChange={onChange}
              orientation={variant === "card" ? "horizontal" : orientation}
              isRequired={isRequired}
              isDisabled={isDisabled || isShow}
              isInvalid={!!fieldError}
            >
              <Label isRequired={isRequired} isInvalid={!!fieldError}>
                {labelText}
              </Label>

              {description && <Description>{description}</Description>}

              {variant === "card" ? (
                <div className={cn("grid gap-3", colsClass[cols])}>
                  {options.map((option) => (
                    <Radio
                      key={option.value}
                      value={option.value}
                      isDisabled={option.isDisabled}
                      className={cn(
                        "group relative flex flex-col rounded-xl border border-default-200 bg-white px-4 py-3.5",
                        "cursor-pointer transition-all duration-150",
                        "hover:border-primary/50 hover:bg-primary/5",
                        "data-[selected=true]:border-primary data-[selected=true]:bg-primary/8",
                        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
                        "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-primary/30",
                      )}
                    >
                      {/* Radio indicator — top right */}
                      <Radio.Control className="absolute right-3 top-3 h-4 w-4 shrink-0">
                        <Radio.Indicator />
                      </Radio.Control>

                      <Radio.Content className="flex flex-col gap-2 pr-5">
                        {option.icon && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-default-100 text-default-600 group-data-[selected=true]:bg-primary/10 group-data-[selected=true]:text-primary transition-colors">
                            {option.icon}
                          </span>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <Label className="cursor-pointer font-semibold text-default-800 group-data-[selected=true]:text-primary">
                            {option.label}
                          </Label>
                          {option.description && (
                            <Description className="text-xs text-default-400">
                              {option.description}
                            </Description>
                          )}
                        </div>
                      </Radio.Content>
                    </Radio>
                  ))}
                </div>
              ) : (
                options.map((option) => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    isDisabled={option.isDisabled}
                  >
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <Radio.Content>
                      <Label>{option.label}</Label>
                      {option.description && (
                        <Description>{option.description}</Description>
                      )}
                    </Radio.Content>
                  </Radio>
                ))
              )}

              {fieldError && <FieldError>{fieldError}</FieldError>}
            </RadioGroup>
          </div>
        );
      }}
    />
  );
};
