import React from "react";
import { Switch, Label, Description } from "@heroui/react";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "@/utils/common";
import { useFormMode } from "@/contexts/FormModeContext";

interface SwitchInputProps extends BaseInputProps {
  size?: "sm" | "md" | "lg";
}

export const SwitchInput: React.FC<SwitchInputProps> = ({
  fieldName,
  fieldLabel,
  requiredMessage,
  isDisabled = false,
  isRequired = false,
  description,
  descriptionClassName,
  hideLabel = false,
  bottomContent,
  additionalRules,
  size = "md",
}) => {
  const { isShow } = useFormMode();
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={labelText}
      requiredMessage={requiredMessage}
      defaultValue={false}
      additionalRules={additionalRules}
      render={({ errors, value, name, onChange }) => {
        const fieldError = getFieldError(errors, fieldName);

        return (
          <div className="w-full mt-4">
            <Switch
              name={name}
              isSelected={!!value}
              onChange={onChange}
              isDisabled={isDisabled || isShow}
              size={size}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              {!hideLabel && (
                <Switch.Content>
                  <Label>{labelText}</Label>
                  {description && (
                    <Description className={descriptionClassName}>
                      {description}
                    </Description>
                  )}
                </Switch.Content>
              )}
            </Switch>
            {fieldError && (
              <p className="text-sm text-danger mt-1">{fieldError}</p>
            )}
            {bottomContent}
          </div>
        );
      }}
    />
  );
};

export default SwitchInput;
