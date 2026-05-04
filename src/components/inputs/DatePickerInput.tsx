import {
  Calendar,
  DateField,
  DatePicker,
  Description,
  FieldError,
  Label,
} from "@heroui/react";
import { parseDate, type DateValue } from "@internationalized/date";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "@/utils/common";
import { useFormMode } from "@/contexts/FormModeContext";

interface DatePickerInputProps extends BaseInputProps {
  minValue?: string;
  maxValue?: string;
}

function tryParseDate(value: string | undefined): DateValue | undefined {
  if (!value) return undefined;
  try {
    return parseDate(value);
  } catch {
    return undefined;
  }
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
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
}) => {
  const { isShow } = useFormMode();
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);

  const parsedMinValue = tryParseDate(minValue);
  const parsedMaxValue = tryParseDate(maxValue);

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={labelText}
      requiredMessage={requiredMessage}
      defaultValue=""
      additionalRules={additionalRules}
      render={({ errors, value, onChange, name }) => {
        const fieldError = getFieldError(errors, fieldName);
        const dateValue = tryParseDate(value as string | undefined);

        const handleChange = (val: DateValue | null) => {
          onChange(val ? val.toString() : "");
        };

        return (
          <div className="w-full mt-4">
            <DatePicker
              name={name}
              value={dateValue ?? null}
              onChange={handleChange}
              isRequired={isRequired}
              isDisabled={isDisabled || isShow}
              isInvalid={!!fieldError}
              minValue={parsedMinValue}
              maxValue={parsedMaxValue}
              className="w-full"
            >
              {!hideLabel && <Label>{labelText}</Label>}
              <DateField.Group fullWidth>
                <DateField.Input>
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateField.Suffix>
                  <DatePicker.Trigger>
                    <DatePicker.TriggerIndicator />
                  </DatePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              {description && (
                <Description className={descriptionClassName}>
                  {description}
                </Description>
              )}
              <FieldError>{fieldError}</FieldError>
              <DatePicker.Popover>
                <Calendar aria-label={`Choose ${labelText}`}>
                  <Calendar.Header>
                    <Calendar.YearPickerTrigger>
                      <Calendar.YearPickerTriggerHeading />
                      <Calendar.YearPickerTriggerIndicator />
                    </Calendar.YearPickerTrigger>
                    <Calendar.NavButton slot="previous" />
                    <Calendar.NavButton slot="next" />
                  </Calendar.Header>
                  <Calendar.Grid>
                    <Calendar.GridHeader>
                      {(day) => (
                        <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                      )}
                    </Calendar.GridHeader>
                    <Calendar.GridBody>
                      {(date) => <Calendar.Cell date={date} />}
                    </Calendar.GridBody>
                  </Calendar.Grid>
                </Calendar>
              </DatePicker.Popover>
            </DatePicker>
            {bottomContent}
          </div>
        );
      }}
    />
  );
};
