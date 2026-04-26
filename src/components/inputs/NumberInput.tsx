import { NumberField, Label, Description, FieldError } from "@heroui/react";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "@/utils/common";

interface NumberInputProps extends BaseInputProps {
  minValue?: number;
  maxValue?: number;
  step?: number;
  formatOptions?: Intl.NumberFormatOptions;
}

export const NumberInput: React.FC<NumberInputProps> = ({
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
  minValue,
  maxValue,
  step,
  formatOptions,
}) => {
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={labelText}
      requiredMessage={requiredMessage}
      defaultValue={0}
      additionalRules={additionalRules}
      render={({ errors, value, ref, onChange, onBlur, name }) => {
        const fieldError = getFieldError(errors, fieldName);

        return (
          <div className="w-full mt-4">
            <NumberField
              name={name}
              value={value as number | undefined}
              onChange={onChange}
              isRequired={isRequired}
              isDisabled={isDisabled}
              isInvalid={!!fieldError}
              minValue={minValue}
              maxValue={maxValue}
              step={step}
              formatOptions={formatOptions}
              className="w-full"
            >
              {!hideLabel && <Label>{labelText}</Label>}
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input ref={ref} onBlur={onBlur} />
                <NumberField.IncrementButton />
              </NumberField.Group>
              {description && (
                <Description className={descriptionClassName}>
                  {description}
                </Description>
              )}
              <FieldError>{fieldError}</FieldError>
            </NumberField>
            {bottomContent}
          </div>
        );
      }}
    />
  );
};
