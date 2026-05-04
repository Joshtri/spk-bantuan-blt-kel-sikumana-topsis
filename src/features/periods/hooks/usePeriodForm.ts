import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useCallback, useEffect, useRef } from "react";
import type { FieldValues } from "react-hook-form";
import { IPeriod } from "../interfaces";

function normalizeTime(t: string): string {
  const parts = t.split(":");
  if (parts.length === 2) return `${t}:00`;
  if (parts.length >= 3) return `${parts[0]}:${parts[1]}:${parts[2]}`;
  return `${t}:00:00`;
}

export function usePeriodForm() {
  const { id } = useParsed();

  const methods = useForm<IPeriod>({
    refineCoreProps: {
      resource: "periods",
      id,
      meta: { getEndpoint: "periods" },
    },
  });

  const queryData = methods.refineCore.query?.data?.data;
  const hasMappedRef = useRef(false);

  // Mapping API data → form fields
  useEffect(() => {
    if (queryData && !hasMappedRef.current) {
      hasMappedRef.current = true;
      const data = queryData as unknown as Record<string, unknown>;
      const startDate = data.startDate as string | undefined;
      const endDate = data.endDate as string | undefined;

      let dateRange = null;
      let startTime = "";
      let endTime = "";

      if (startDate) {
        const d = new Date(startDate);
        startTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      }

      if (endDate) {
        const d = new Date(endDate);
        endTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      }

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        dateRange = {
          start: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`,
          end: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`,
        };
      }

      methods.reset({
        id: data.id,
        name: data.name ?? "",
        description: data.description ?? "",
        isActive: data.isActive ?? false,
        dateRange,
        startTime,
        endTime,
      });
    }
  }, [queryData, methods]);

  // Mapping form fields → API payload
  const handleSave = useCallback(async (data: FieldValues) => {
    const dateStart = data.dateRange?.start ?? "";
    const dateEnd = data.dateRange?.end ?? "";
    const timeStart = data.startTime ?? "00:00";
    const timeEnd = data.endTime ?? "00:00";

    const payload: Partial<IPeriod> = {
      id: data.id,
      name: data.name,
      description: data.description,
      startDate: `${dateStart}T${normalizeTime(timeStart)}Z`,
      endDate: `${dateEnd}T${normalizeTime(timeEnd)}Z`,
      isActive: data.isActive,
    };

    await methods.refineCore.onFinish(payload);
  }, [methods]);

  return { methods, handleSave };
}
