import { useState } from "react";
import {
  Description,
  FieldError,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { getFieldError, toEachCapitalize } from "@/utils/common";
import { useFormMode } from "@/contexts/FormModeContext";

interface PhoneNumberInputProps extends BaseInputProps {
  placeholder?: string;
}

/**
 * Strips any +62 / 62 / 0 prefix and non-digit chars from raw input,
 * returning only the local subscriber digits (e.g. "85298xxxxxx").
 */
function toLocalDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("62")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

/** RHF-stored value is always "+62<local>" or "" */
function toFullE164(local: string): string {
  return local ? `+62${local}` : "";
}

/** Derive the display string (local part only) from the stored RHF value. */
function toDisplayValue(stored: string): string {
  if (!stored) return "";
  if (stored.startsWith("+62")) return stored.slice(3);
  if (stored.startsWith("62")) return stored.slice(2);
  if (stored.startsWith("0")) return stored.slice(1);
  return stored.replace(/\D/g, "");
}

// Indonesian Flag SVG Component
const IndonesianFlag: React.FC = () => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 30 20"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-sm"
    aria-label="Indonesian flag"
  >
    <rect width="30" height="10" fill="#FF0000" />
    <rect y="10" width="30" height="10" fill="#ececec" />
  </svg>
);

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  fieldName,
  fieldLabel,
  requiredMessage,
  isRequired = false,
  isDisabled = false,
  description,
  descriptionClassName,
  hideLabel = false,
  placeholder = "85XXXXXXXXX",
  bottomContent,
  additionalRules,
}) => {
  const { isShow } = useFormMode();
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);
  const [copied, setCopied] = useState(false);

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={labelText}
      requiredMessage={requiredMessage}
      defaultValue=""
      additionalRules={{
        ...(additionalRules ?? {}),
        pattern: additionalRules?.pattern ?? {
          value: /^\+62[0-9]{7,12}$/,
          message: "Format nomor tidak valid (contoh: +6285298000000)",
        },
      }}
      render={({ errors, value, onChange, onBlur, name }) => {
        const fieldError = getFieldError(errors, fieldName);
        const displayValue = toDisplayValue((value as string) ?? "");

        const handleChange = (raw: string) => {
          const local = toLocalDigits(raw);
          onChange(toFullE164(local));
        };

        const handleCopy = async () => {
          const full = toFullE164(
            displayValue ? toLocalDigits(displayValue) : "",
          );
          if (!full) return;
          await navigator.clipboard.writeText(full);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        };

        return (
          <div className="w-full mt-4">
            <TextField
              name={name}
              type="tel"
              value={displayValue}
              onChange={handleChange}
              onBlur={onBlur}
              isRequired={isRequired}
              isDisabled={isDisabled || isShow}
              isInvalid={!!fieldError}
              className="w-full"
            >
              {!hideLabel && <Label isRequired={isRequired}>{labelText}</Label>}

              <InputGroup>
                {/* Indonesia flag + country code — fixed, not editable */}
                <InputGroup.Prefix className="select-none gap-1.5 text-sm font-medium text-default-700">
                  <IndonesianFlag />
                  <span>+62</span>
                </InputGroup.Prefix>

                <InputGroup.Input
                  placeholder={placeholder}
                  inputMode="numeric"
                />

                {/* Copy to clipboard */}
                <InputGroup.Suffix>
                  <button
                    type="button"
                    aria-label="Copy phone number"
                    disabled={!displayValue || isDisabled || isShow}
                    onClick={handleCopy}
                    className="px-1 text-default-400 transition-colors hover:text-default-700 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none"
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4 text-success" />
                    ) : (
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    )}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>

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
