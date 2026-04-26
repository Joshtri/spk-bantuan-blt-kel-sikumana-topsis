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

  return <CreateOrEditWrapper methods={methods} tabs={tabsPeriod} />;
}
