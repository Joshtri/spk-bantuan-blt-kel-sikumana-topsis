import {
  Autocomplete,
  Description,
  FieldError,
  Label,
  ListBox,
  SearchField,
  useFilter,
} from "@heroui/react";
import FormController from "@/components/form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "@/utils/common";
import { useFormMode } from "@/contexts/FormModeContext";
import type { SelectItemType } from "@/interfaces/common";

type OptionItem = SelectItemType | { id: string; label: string };

interface AutoCompleteInputProps extends BaseInputProps {
  options: OptionItem[];
  placeholder?: string;
  selectionMode?: "single" | "multiple";
}

function getOptionId(opt: OptionItem): string {
  return (opt as { id?: string }).id ?? (opt as SelectItemType).key ?? "";
}

function getOptionLabel(opt: OptionItem): string {
  return opt.label ?? "";
}

export const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
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
  options,
  selectionMode = "single",
}) => {
  const { isShow } = useFormMode();
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);
  const { contains } = useFilter({ sensitivity: "base" });

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={labelText}
      requiredMessage={requiredMessage}
      defaultValue={null}
      render={({ errors, value, onChange }) => {
        const fieldError = getFieldError(errors, fieldName);

        return (
          <div className="w-full mt-4">
            <Autocomplete
              selectedKey={value ?? null}
              onSelectionChange={(key) => onChange(key)}
              selectionMode={selectionMode}
              aria-label={labelText}
              isDisabled={isDisabled || isShow}
              isInvalid={!!fieldError}
              isRequired={isRequired}
              variant="primary"
              fullWidth
            >
              {!hideLabel && <Label>{labelText}</Label>}
              <Autocomplete.Trigger>
                <Autocomplete.Value
                  aria-placeholder={
                    placeholder ?? `Select ${labelText.toLowerCase()}`
                  }
                />
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
              </Autocomplete.Trigger>
              {description && (
                <Description className={descriptionClassName}>
                  {description}
                </Description>
              )}
              <FieldError>{fieldError}</FieldError>
              <Autocomplete.Popover>
                <Autocomplete.Filter
                  filter={(text, input) => contains(text, input)}
                >
                  <SearchField aria-label="Search">
                    <SearchField.Group>
                      <SearchField.SearchIcon />
                      <SearchField.Input
                        aria-label="Search"
                        placeholder="Search..."
                      />
                    </SearchField.Group>
                  </SearchField>
                  <ListBox aria-label={`${labelText} options`}>
                    {options.map((opt) => {
                      const optionId = getOptionId(opt);
                      const optionLabel = getOptionLabel(opt);
                      return (
                        <ListBox.Item
                          id={optionId}
                          key={optionId}
                          textValue={optionLabel}
                        >
                          <Label>{optionLabel}</Label>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      );
                    })}
                  </ListBox>
                </Autocomplete.Filter>
              </Autocomplete.Popover>
            </Autocomplete>
            {bottomContent}
          </div>
        );
      }}
    />
  );
};
