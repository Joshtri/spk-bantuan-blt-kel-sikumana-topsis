import {
  DateField,
  DateRangePicker,
  Description,
  FieldError,
  Label,
  RangeCalendar,
  TimeField,
} from "@heroui/react";
import type { TimeValue } from "@heroui/react";
import {
  parseZonedDateTime,
  parseDate,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "@/utils/common";
import { useFormMode } from "@/contexts/FormModeContext";

interface DateRangePickerInputProps extends BaseInputProps {
  minValue?: string;
  maxValue?: string;
  withTime?: boolean; // tambah prop ini
}

type DateRangeValue = { start: DateValue; end: DateValue } | null;

function tryParseDate(value: string | undefined): DateValue | undefined {
  if (!value) return undefined;
  try {
    // coba parse sebagai zoned datetime dulu, fallback ke date only
    return parseZonedDateTime(value);
  } catch {
    try {
      return parseDate(value);
    } catch {
      return undefined;
    }
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
  withTime = false, // default false, kalau true munculkan time picker
}) => {
  const { isShow } = useFormMode();
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);
  const parsedMinValue = tryParseDate(minValue);
  const parsedMaxValue = tryParseDate(maxValue);

  const granularity = withTime ? "minute" : "day";

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
          <div className="w-72">
            <DateRangePicker
              value={rangeValue}
              onChange={handleChange}
              isRequired={isRequired}
              isDisabled={isDisabled || isShow}
              isInvalid={!!fieldError}
              minValue={parsedMinValue}
              maxValue={parsedMaxValue}
              granularity={granularity}
              hideTimeZone={true}
              hourCycle={24}
              className="w-full"
            >
              {({ state }) => (
                <>
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

                  <DateRangePicker.Popover className="flex w-full flex-col gap-3">
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
                            <RangeCalendar.HeaderCell>
                              {day}
                            </RangeCalendar.HeaderCell>
                          )}
                        </RangeCalendar.GridHeader>
                        <RangeCalendar.GridBody>
                          {(date) => <RangeCalendar.Cell date={date} />}
                        </RangeCalendar.GridBody>
                      </RangeCalendar.Grid>
                      <RangeCalendar.YearPickerGrid>
                        <RangeCalendar.YearPickerGridBody>
                          {({ year }) => (
                            <RangeCalendar.YearPickerCell year={year} />
                          )}
                        </RangeCalendar.YearPickerGridBody>
                      </RangeCalendar.YearPickerGrid>
                    </RangeCalendar>

                    {/* Time picker hanya muncul kalau withTime = true */}
                    {withTime && (
                      <div className="flex flex-col gap-3 px-1 pb-2">
                        <div className="flex items-center justify-between gap-4">
                          <Label className="w-24 shrink-0 text-sm">Waktu Mulai</Label>
                          <TimeField
                            aria-label="Waktu Mulai"
                            granularity="minute"
                            hideTimeZone
                            hourCycle={24}
                            value={state.timeRange?.start ?? null}
                            onChange={(v) =>
                              state.setTimeRange({
                                end: state.timeRange?.end as TimeValue,
                                start: v as TimeValue,
                              })
                            }
                          >
                            <TimeField.Group variant="secondary">
                              <TimeField.Input>
                                {(segment) => (
                                  <TimeField.Segment segment={segment} />
                                )}
                              </TimeField.Input>
                            </TimeField.Group>
                          </TimeField>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <Label className="w-24 shrink-0 text-sm">Waktu Selesai</Label>
                          <TimeField
                            aria-label="Waktu Selesai"
                            granularity="minute"
                            hideTimeZone
                            hourCycle={24}
                            value={state.timeRange?.end ?? null}
                            onChange={(v) =>
                              state.setTimeRange({
                                end: v as TimeValue,
                                start: state.timeRange?.start as TimeValue,
                              })
                            }
                          >
                            <TimeField.Group variant="secondary">
                              <TimeField.Input>
                                {(segment) => (
                                  <TimeField.Segment segment={segment} />
                                )}
                              </TimeField.Input>
                            </TimeField.Group>
                          </TimeField>
                        </div>
                      </div>
                    )}
                  </DateRangePicker.Popover>
                </>
              )}
            </DateRangePicker>
            {bottomContent}
          </div>
        );
      }}
    />
  );
};

export default DateRangePickerInput;