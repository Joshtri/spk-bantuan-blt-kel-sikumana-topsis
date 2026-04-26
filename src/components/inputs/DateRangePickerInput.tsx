import {
  DateField,
  DateRangePicker,
  Description,
  FieldError,
  Label,
  RangeCalendar,
} from "@heroui/react";
import { parseDate, type DateValue } from "@internationalized/date";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "@/utils/common";

interface DateRangePickerInputProps extends BaseInputProps {
  minValue?: string;
  maxValue?: string;
}

type DateRangeValue = { start: DateValue; end: DateValue } | null;

function tryParseDate(value: string | undefined): DateValue | undefined {
  if (!value) return undefined;
  try {
    return parseDate(value);
  } catch {
    return undefined;
  }
}

function parseRange(value: unknown): DateRangeValue {
  if (!value || typeof value !== "object") return null;
  const v = value as { start?: string; end?: string };
  const start = tryParseDate(v.start);
  const end = tryParseDate(v.end);
  if (!start || !end) return null;
  return { start, end };
}

export const DateRangePickerInput: React.FC<DateRangePickerInputProps> = ({
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
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);
  const parsedMinValue = tryParseDate(minValue);
  const parsedMaxValue = tryParseDate(maxValue);

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={labelText}
      requiredMessage={requiredMessage}
      additionalRules={additionalRules}
      render={({ errors, value, onChange }) => {
        const fieldError = getFieldError(errors, fieldName);
        const rangeValue = parseRange(value);

        const handleChange = (val: DateRangeValue) => {
          onChange(
            val
              ? { start: val.start.toString(), end: val.end.toString() }
              : null,
          );
        };

        return (
          <div className="w-full">
            <DateRangePicker
              value={rangeValue}
              onChange={handleChange}
              isRequired={isRequired}
              isDisabled={isDisabled}
              isInvalid={!!fieldError}
              minValue={parsedMinValue}
              maxValue={parsedMaxValue}
              className="w-full"
            >
              {!hideLabel && <Label>{labelText}</Label>}
              <DateField.Group fullWidth>
                <DateField.InputContainer>
                  <DateField.Input slot="start">
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateRangePicker.RangeSeparator />
                  <DateField.Input slot="end">
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                </DateField.InputContainer>
                <DateField.Suffix>
                  <DateRangePicker.Trigger>
                    <DateRangePicker.TriggerIndicator />
                  </DateRangePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              {description && (
                <Description className={descriptionClassName}>
                  {description}
                </Description>
              )}
              <FieldError>{fieldError}</FieldError>
              <DateRangePicker.Popover>
                <RangeCalendar aria-label={`Choose ${labelText}`}>
                  <RangeCalendar.Header>
                    <RangeCalendar.YearPickerTrigger>
                      <RangeCalendar.YearPickerTriggerHeading />
                      <RangeCalendar.YearPickerTriggerIndicator />
                    </RangeCalendar.YearPickerTrigger>
                    <RangeCalendar.NavButton slot="previous" />
                    <RangeCalendar.NavButton slot="next" />
                  </RangeCalendar.Header>
                  <RangeCalendar.Grid>
                    <RangeCalendar.GridHeader>
                      {(day) => (
                        <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                      )}
                    </RangeCalendar.GridHeader>
                    <RangeCalendar.GridBody>
                      {(date) => <RangeCalendar.Cell date={date} />}
                    </RangeCalendar.GridBody>
                  </RangeCalendar.Grid>
                </RangeCalendar>
              </DateRangePicker.Popover>
            </DateRangePicker>
            {bottomContent}
          </div>
        );
      }}
    />
  );
};

export default DateRangePickerInput;
