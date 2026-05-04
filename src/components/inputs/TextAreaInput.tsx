import {
  Description,
  FieldError,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "../../utils/common";
import { useFormMode } from "@/contexts/FormModeContext";

interface TextAreaInputProps extends BaseInputProps {
  isHorizontal?: boolean;
  labelWidth?: string;
  placeholder?: string;
  tabLabel?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  showCount?: boolean;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  fieldName,
  fieldLabel,
  requiredMessage,
  isDisabled = false,
  isRequired = false,
  description,
  descriptionClassName,
  hideLabel = false,
  placeholder,
  bottomContent,
  additionalRules,
  rows,
  minLength,
  maxLength,
  showCount = false,
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
      render={({ errors, value, ref, onChange, onBlur, name }) => {
        const fieldError = getFieldError(errors, fieldName);
        const textValue = typeof value === "string" ? value : (value ?? "");
        const countText = showCount
          ? `Characters: ${textValue.length}${
              maxLength ? ` / ${maxLength}` : ""
            }`
          : null;

        return (
          <div className="w-full mt-4">
            <TextField
              name={name}
              value={textValue}
              onChange={onChange}
              isRequired={isRequired}
              isDisabled={isDisabled || isShow}
              isInvalid={!!fieldError}
              className="w-full"
            >
              {!hideLabel && <Label>{labelText}</Label>}
              <TextArea
                ref={ref}
                placeholder={placeholder ?? `Enter ${labelText.toLowerCase()}`}
                onBlur={onBlur}
                rows={rows}
                minLength={minLength}
                maxLength={maxLength}
                className="w-full"
              />
              {(description || countText) && (
                <Description className={descriptionClassName}>
                  {description}
                  {description && countText && <span className="mx-1">•</span>}
                  {countText}
                </Description>
              )}
              <FieldError>{fieldError}</FieldError>
            </TextField>
            {bottomContent}
          </div>
        );
      }}
    />
  );
};
