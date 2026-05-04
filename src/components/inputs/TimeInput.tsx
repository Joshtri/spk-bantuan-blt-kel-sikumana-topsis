import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Button,
  FieldError,
  Label,
  TimeField,
} from "@heroui/react";
import { parseTime, Time } from "@internationalized/date";
import { PressEvent } from "@react-aria/interactions";
import { get } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";

import FormController, { FormControllerProps } from "../form/FormController";
import { Text } from "../text";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useFormMode } from "@/contexts/FormModeContext";

type FormatOutput = "time" | "iso" | ((time: string) => string);

// ─── ScrollWheel ─────────────────────────────────────────────────────────────
interface ScrollWheelProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  format?: (value: T) => string;
}

const ScrollWheel = <T extends string | number>({
  options,
  value,
  onChange,
  label,
  format = (v) => String(v).padStart(2, "0"),
}: ScrollWheelProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemHeight = 36;

  useEffect(() => {
    if (scrollRef.current) {
      const index = options.indexOf(value);
      if (index !== -1) {
        const current = scrollRef.current.scrollTop;
        if (Math.abs(current - index * itemHeight) > 5) {
          isProgrammaticScroll.current = true;
          scrollRef.current.scrollTop = index * itemHeight;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            isProgrammaticScroll.current = false;
          }, 100);
        }
      }
    }
  }, [value, options]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticScroll.current) return;
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (index >= 0 && index < options.length) {
      const newValue = options[index];
      if (newValue !== value) onChange(newValue);
    }
  };

  const handleItemClick = (opt: T) => {
    if (opt === value) return;
    isProgrammaticScroll.current = true;
    onChange(opt);
    if (scrollRef.current) {
      const idx = options.indexOf(opt);
      scrollRef.current.scrollTo({ top: idx * itemHeight, behavior: "smooth" });
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 500);
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <span className="mb-0 text-[9px] font-extrabold uppercase tracking-widest text-gray-400/80">
        {label}
      </span>
      <div className="relative h-[252px] w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 right-0 top-[108px] h-[36px] border-y border-gray-100 bg-gray-50/30" />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "y mandatory",
          }}
        >
          <div style={{ height: "108px" }} />
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleItemClick(opt)}
              className={`flex h-[36px] cursor-pointer items-center justify-center text-sm transition-all duration-200 ${
                value === opt
                  ? "scale-110 font-bold text-primary"
                  : "text-gray-400 opacity-60"
              }`}
              style={{ scrollSnapAlign: "center" }}
            >
              {format(opt)}
            </div>
          ))}
          <div style={{ height: "108px" }} />
        </div>
      </div>
    </div>
  );
};

// ─── Format helper ────────────────────────────────────────────────────────────
const formatTimeOutput = (
  time: string,
  format: FormatOutput = "time",
  baseDate?: string,
) => {
  if (typeof format === "function") return format(time);
  if (format === "iso") {
    const date = baseDate ?? new Date().toISOString().split("T")[0];
    return `${date}T${time}`;
  }
  return time;
};

// ─── TimePickerContent ────────────────────────────────────────────────────────
interface TimePickerContentProps {
  value: Time | null;
  minHour?: number;
  maxHour?: number;
  minuteStep?: number;
  onApply: (time: Time) => void;
  onCancel: () => void;
}

const TimePickerContent: React.FC<TimePickerContentProps> = ({
  value,
  minHour = 0,
  maxHour = 23,
  minuteStep = 1,
  onApply,
  onCancel,
}) => {
  const h24 = value?.hour ?? Math.max(minHour, Math.min(maxHour, 10));
  const [selectedHour, setSelectedHour] = useState(h24 % 12 || 12);
  const [selectedMinute, setSelectedMinute] = useState(() => {
    const m = value?.minute ?? 0;
    return (Math.round(m / minuteStep) * minuteStep) % 60;
  });
  const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM">(
    h24 >= 12 ? "PM" : "AM",
  );

  const handleApply = (_e: PressEvent) => {
    let hour = selectedHour % 12;
    if (selectedAMPM === "PM") hour += 12;
    onApply(new Time(hour, selectedMinute));
  };

  const handleNow = (_e: PressEvent) => {
    const now = new Date();
    let currentH24 = now.getHours();
    if (currentH24 < minHour) currentH24 = minHour;
    if (currentH24 > maxHour) currentH24 = maxHour;
    const newAMPM = currentH24 >= 12 ? "PM" : "AM";
    setSelectedAMPM(newAMPM);
    setSelectedHour(currentH24 % 12 || 12);
    setSelectedMinute(() => {
      const m = now.getMinutes();
      return (Math.round(m / minuteStep) * minuteStep) % 60;
    });
  };

  const hours = useMemo(() => {
    const available = [];
    for (let h12 = 1; h12 <= 12; h12++) {
      let h24 = h12 % 12;
      if (selectedAMPM === "PM") h24 += 12;
      if (h24 >= minHour && h24 <= maxHour) available.push(h12);
    }
    return available.sort((a, b) => (a === 12 ? -1 : b === 12 ? 1 : a - b));
  }, [minHour, maxHour, selectedAMPM]);

  const handleAMPMChange = (ampm: "AM" | "PM") => {
    setSelectedAMPM(ampm);
    const futureHours = [];
    for (let h12 = 1; h12 <= 12; h12++) {
      let h24 = h12 % 12;
      if (ampm === "PM") h24 += 12;
      if (h24 >= minHour && h24 <= maxHour) futureHours.push(h12);
    }
    if (futureHours.length > 0 && !futureHours.includes(selectedHour)) {
      setSelectedHour(futureHours.includes(12) ? 12 : futureHours[0]);
    }
  };

  const allMinutes = useMemo(() => {
    const steps = [];
    for (let m = 0; m < 60; m += minuteStep) steps.push(m);
    return steps.length > 0 ? steps : [0];
  }, [minuteStep]);

  const periods: ("AM" | "PM")[] = useMemo(() => {
    const available: ("AM" | "PM")[] = [];
    if (minHour < 12 || maxHour < 12) available.push("AM");
    if (maxHour >= 12 || minHour >= 12) available.push("PM");
    return available.length > 0 ? available : ["AM", "PM"];
  }, [minHour, maxHour]);

  return (
    <div className="flex flex-col bg-white">
      {/* Preview */}
      <div className="border-b border-gray-200 px-4 py-1.5 text-center">
        <Text size="lg" weight="bold">
          {String(selectedHour).padStart(2, "0")}:
          {String(selectedMinute).padStart(2, "0")} {selectedAMPM}
        </Text>
      </div>

      {/* Scroll wheels */}
      <div className="flex justify-between gap-1 bg-white px-4 py-2">
        <ScrollWheel
          label="Hour"
          options={hours}
          value={selectedHour}
          onChange={setSelectedHour}
        />
        <div className="flex items-center pt-4 text-gray-300">
          <span className="text-sm font-light">:</span>
        </div>
        <ScrollWheel
          label="Minute"
          options={allMinutes}
          value={selectedMinute}
          onChange={setSelectedMinute}
        />
        <div className="w-2" />
        <ScrollWheel
          label="AM/PM"
          options={periods}
          value={selectedAMPM}
          onChange={handleAMPMChange}
          format={(v) => String(v)}
        />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 border-t border-gray-100">
        <Button
          variant="ghost"
          onPress={onCancel}
          className="h-11 rounded-none text-xs font-semibold text-gray-500"
        >
          Cancel
        </Button>
        <Button
          variant="ghost"
          type="button"
          onPress={handleNow}
          className="h-11 rounded-none text-[10px] font-bold uppercase tracking-widest text-danger"
        >
          Now
        </Button>
        <Button
          variant="primary"
          onPress={handleApply}
          className="h-11 rounded-none text-xs font-bold"
        >
          Set
        </Button>
      </div>
    </div>
  );
};

// ─── TimeInput ────────────────────────────────────────────────────────────────
export interface TimeInputProps
  extends Omit<FormControllerProps, "defaultValue" | "isRequired" | "render"> {
  fieldName: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isHorizontal?: boolean;
  labelWidth?: string;
  bottomContent?: React.ReactNode;
  defaultValue?: string;
  formatOutput?: FormatOutput;
  baseDate?: string;
  minHour?: number;
  maxHour?: number;
  minuteStep?: number;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  fieldName,
  label,
  isRequired = false,
  requiredMessage,
  additionalRules,
  isDisabled,
  isHorizontal,
  labelWidth = "200px",
  bottomContent,
  defaultValue = "",
  formatOutput = "time",
  baseDate,
  minHour,
  maxHour,
  minuteStep,
}) => {
  const { isShow } = useFormMode();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const effectiveDisabled = isDisabled || isShow;
  const PANEL_WIDTH = 240;
  const PANEL_HEIGHT_ESTIMATE = 360; // header + wheels + actions
  const EDGE_GAP = 8;

  // Compute picker position relative to viewport, with viewport-bound clamping
  // and flip-above when there's not enough room below the trigger.
  useLayoutEffect(() => {
    if (!isPickerOpen) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Use the actual rendered panel height when available
      const panelH = panelRef.current?.offsetHeight ?? PANEL_HEIGHT_ESTIMATE;

      // Horizontal: prefer right-aligning to trigger, but clamp inside viewport
      let left = rect.right - PANEL_WIDTH;
      if (left + PANEL_WIDTH > vw - EDGE_GAP) left = vw - EDGE_GAP - PANEL_WIDTH;
      if (left < EDGE_GAP) left = EDGE_GAP;

      // Vertical: try below; if it overflows, flip above the trigger
      let top = rect.bottom + 4;
      if (top + panelH > vh - EDGE_GAP) {
        const flippedTop = rect.top - panelH - 4;
        top = flippedTop >= EDGE_GAP ? flippedTop : Math.max(EDGE_GAP, vh - panelH - EDGE_GAP);
      }

      setPickerPos({ top, left });
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isPickerOpen]);

  // Close picker when clicking outside (trigger or panel)
  useEffect(() => {
    if (!isPickerOpen) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inTrigger && !inPanel) setIsPickerOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isPickerOpen]);

  const isSmallDevice = useMediaQuery("(max-width: 640px)");
  const isMediumDevice = useMediaQuery("(min-width: 641px) and (max-width: 768px)");
  const isLargeDevice = useMediaQuery("(min-width: 769px) and (max-width: 1100px)");

  const shouldBeHorizontal = useMemo(
    () => isHorizontal ?? !(isSmallDevice || isMediumDevice || isLargeDevice),
    [isHorizontal, isSmallDevice, isMediumDevice, isLargeDevice],
  );

  const labelContent = useMemo(
    () =>
      label ? (
        <Text size="sm" weight="semibold" className="text-black">
          {label}
          {isRequired ? (
            <span className="ml-0.5 text-sm text-danger">*</span>
          ) : null}
        </Text>
      ) : null,
    [label, isRequired],
  );

  return (
    <FormController
      isRequired={isRequired}
      requiredMessage={requiredMessage}
      additionalRules={additionalRules}
      fieldLabel={label}
      fieldName={fieldName}
      defaultValue={defaultValue}
      render={({ errors, isLoading, onChange, value }) => {
        const computeTimeValue = (): Time | null => {
          if (!value) return null;
          const stripTz = (t: string) =>
            t.replace(/Z$/i, "").replace(/[+-]\d{2}:?\d{2}$/, "");
          try {
            if (typeof value === "string" && value.includes("T")) {
              return parseTime(stripTz(value.split("T")[1]));
            }
            return parseTime(stripTz(value as string));
          } catch {
            return null;
          }
        };

        const timeValue = computeTimeValue();
        const fieldError = get(errors, fieldName);

        const handleTimeChange = (time: Time) => {
          if (!time) return;
          const output = formatTimeOutput(time.toString(), formatOutput, baseDate);
          onChange(output);
        };

        const timeFieldElement = (
          <div className="w-full">
            {/* Trigger button is a SIBLING of TimeField (not a descendant)
                so React Aria's input-group press handlers can't swallow the click. */}
            <div className="flex w-full items-end gap-2">
              <div className="flex-1">
                <TimeField
                  value={timeValue}
                  onChange={(v) => v && handleTimeChange(v as Time)}
                  isDisabled={effectiveDisabled ?? isLoading}
                  isInvalid={!!fieldError}
                  granularity="minute"
                  hourCycle={12}
                  aria-label={label ?? fieldName}
                >
                  {!shouldBeHorizontal && label && <Label>{label}</Label>}
                  <TimeField.Group>
                    <TimeField.Input>
                      {(segment) => <TimeField.Segment segment={segment} />}
                    </TimeField.Input>
                  </TimeField.Group>
                  <FieldError>{fieldError?.message}</FieldError>
                </TimeField>
              </div>

              {!effectiveDisabled && (
                <button
                  ref={triggerRef}
                  type="button"
                  aria-label="Select time"
                  onClick={() => setIsPickerOpen((prev) => !prev)}
                  className="mb-0.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-default-200 bg-white text-gray-500 transition-all hover:border-primary hover:text-primary active:scale-95"
                >
                  <ClockIcon className="size-4.5" />
                </button>
              )}
            </div>

            {/* Portal the panel into <body> with fixed positioning to escape
                any overflow:hidden on parent Cards/containers. */}
            {isPickerOpen &&
              createPortal(
                <div
                  ref={panelRef}
                  style={{
                    position: "fixed",
                    top: pickerPos.top,
                    left: pickerPos.left,
                    width: PANEL_WIDTH,
                    zIndex: 9999,
                  }}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl"
                >
                  <TimePickerContent
                    value={timeValue}
                    minHour={minHour}
                    maxHour={maxHour}
                    minuteStep={minuteStep}
                  onApply={(time) => {
                    handleTimeChange(time);
                    setIsPickerOpen(false);
                  }}
                    onCancel={() => setIsPickerOpen(false)}
                  />
                </div>,
                document.body,
              )}
          </div>
        );

        if (shouldBeHorizontal) {
          return (
            <div className="flex items-start gap-4 pt-2">
              {labelContent && (
                <div
                  className="flex-shrink-0 pt-2 text-right text-gray-700"
                  style={{ width: labelWidth }}
                >
                  {labelContent}
                </div>
              )}
              <div className="flex-1">
                {timeFieldElement}
                {bottomContent}
              </div>
            </div>
          );
        }

        return (
          <div className="w-full pt-2">
            {timeFieldElement}
            {bottomContent}
          </div>
        );
      }}
    />
  );
};
