import { useState } from "react";
import {
  Description,
  FieldError,
  Input,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "../../utils/common";

interface TextInputProps extends BaseInputProps {
  isPhoneNumber?: boolean;
  isIPAddress?: boolean;
  isEmail?: boolean;
  isPassword?: boolean;
  isHorizontal?: boolean;
  labelWidth?: string;
  placeholder?: string;
  tabLabel?: string;
}

// ---------------------------------------------------------------------------
// Password field — extracted so it can own the visible/hidden toggle state
// ---------------------------------------------------------------------------

interface PasswordFieldProps {
  name: string;
  value: string;
  inputRef: React.Ref<HTMLInputElement>;
  onChange: (value: string) => void;
  onBlur: () => void;
  isRequired: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  labelText: string;
  hideLabel: boolean;
  placeholder: string;
  description?: React.ReactNode;
  descriptionClassName?: string;
  fieldError?: string;
}

function PasswordField({
  name,
  value,
  inputRef,
  onChange,
  onBlur,
  isRequired,
  isDisabled,
  isInvalid,
  labelText,
  hideLabel,
  placeholder,
  description,
  descriptionClassName,
  fieldError,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      name={name}
      type={visible ? "text" : "password"}
      value={value ?? ""}
      onChange={onChange}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      className="w-full"
    >
      {!hideLabel && <Label>{labelText}</Label>}
      <InputGroup>
        <InputGroup.Input
          ref={inputRef}
          placeholder={placeholder}
          onBlur={onBlur}
          // fullWidth
          
        />
        <InputGroup.Suffix>
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            className="px-1 text-muted hover:text-(--foreground) transition-colors focus:outline-none"
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? (
              <EyeIcon className="h-4 w-4" />
            ) : (
              <EyeSlashIcon className="h-4 w-4" />
            )}
          </button>
        </InputGroup.Suffix>
      </InputGroup>
      {description && (
        <Description className={descriptionClassName}>{description}</Description>
      )}
      <FieldError>{fieldError}</FieldError>
    </TextField>
  );
}

// ---------------------------------------------------------------------------
// TextInput
// ---------------------------------------------------------------------------

export const TextInput: React.FC<TextInputProps> = ({
  fieldName,
  fieldLabel,
  requiredMessage,
  isPhoneNumber,
  isIPAddress,
  isEmail,
  isPassword,
  isDisabled = false,
  isRequired = false,
  description,
  descriptionClassName,
  hideLabel = false,
  placeholder,
  bottomContent,
  additionalRules,
}) => {
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);
  const inputType = isEmail ? "email" : isPhoneNumber ? "tel" : "text";

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={labelText}
      requiredMessage={requiredMessage}
      defaultValue=""
      additionalRules={{
        ...(additionalRules ?? {}),
        ...(isEmail &&
          !additionalRules?.pattern && {
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          }),
        ...(isPhoneNumber &&
          !additionalRules?.pattern && {
            pattern: {
              value: /^[+]?[0-9\s\-.()]{7,20}$/,
              message: "Invalid phone number format",
            },
          }),
        ...(isIPAddress &&
          !additionalRules?.pattern && {
            pattern: {
              value: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/,
              message: "Invalid IP address",
            },
          }),
      }}
      render={({ errors, value, ref, onChange, onBlur, name }) => {
        const fieldError = getFieldError(errors, fieldName);

        if (isPassword) {
          return (
            <div className="w-full mt-4">
              <PasswordField
                name={name}
                value={value ?? ""}
                inputRef={ref}
                onChange={onChange}
                onBlur={onBlur}
                isRequired={isRequired}
                isDisabled={isDisabled}
                isInvalid={!!fieldError}
                labelText={labelText}
                hideLabel={hideLabel}
                placeholder={placeholder ?? `Enter ${labelText.toLowerCase()}`}
                description={description}
                descriptionClassName={descriptionClassName}
                fieldError={fieldError}
              />
              {bottomContent}
            </div>
          );
        }

        return (
          <div className="w-full mt-4">
            <TextField
              name={name}
              type={inputType}
              value={value ?? ""}
              onChange={onChange}
              isRequired={isRequired}
              isDisabled={isDisabled}
              isInvalid={!!fieldError}
              className="w-full"
            >
              {!hideLabel && <Label>{labelText}</Label>}
              <Input
                ref={ref}
                placeholder={placeholder ?? `Enter ${labelText.toLowerCase()}`}
                onBlur={onBlur}
                fullWidth
              />
              {description && (
                <Description className={descriptionClassName}>
                  {description}
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
