import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { usePeriodForm } from "@/features/periods/hooks/usePeriodForm";
import { tabsPeriod } from "@/features/periods/tabs";

export default function PeriodEditPage() {
  const { methods, handleSave } = usePeriodForm();

  return (
    <CreateOrEditWrapper
      methods={methods}
      tabs={tabsPeriod}
      onSave={handleSave}
    />
  );
}
