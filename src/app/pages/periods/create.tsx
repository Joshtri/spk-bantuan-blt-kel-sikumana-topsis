import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { IPeriod } from "@/features/periods/interfaces";
import { tabsPeriod } from "@/features/periods/tabs";
import { useForm } from "@refinedev/react-hook-form";

export default function PeriodCreatePage() {
  const methods = useForm<IPeriod>({
    refineCoreProps: {
      resource: "periods",
    },
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      isActive: true,
    },
  });

  const handleSave = async (data: any) => {
    // ── Merge dateRange + time ──────────────────────────────
    const dateStart = data.dateRange?.start ?? ""; // "2025-06-01"
    const dateEnd = data.dateRange?.end ?? ""; // "2025-06-30"
    const timeStart = data.startTime ?? "00:00"; // "08:30"
    const timeEnd = data.endTime ?? "00:00"; // "17:00"

    // Format: "2025-06-01T08:30:00+07:00"  → DateTimeOffset di C#
    const offset = "Z";

    // Helper: pastikan format waktu selalu HH:mm:ss
    const normalizeTime = (t: string) => {
      const parts = t.split(":");
      if (parts.length === 2) return `${t}:00`;
      if (parts.length >= 3) return `${parts[0]}:${parts[1]}:${parts[2]}`;
      return `${t}:00:00`;
    };

    const payload: Partial<IPeriod> = {
      name: data.name,
      description: data.description,
      startDate: `${dateStart}T${normalizeTime(timeStart)}${offset}`,
      endDate: `${dateEnd}T${normalizeTime(timeEnd)}${offset}`,
      isActive: data.isActive,
    };

    // Refine onFinish — ini yang trigger API call ke backend
    await methods.refineCore.onFinish(payload);
  };

  return (
    <CreateOrEditWrapper
      methods={methods}
      tabs={tabsPeriod}
      onSave={handleSave}
    />
  );
}
