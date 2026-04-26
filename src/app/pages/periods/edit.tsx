import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsPeriod } from "@/features/periods/tabs";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function PeriodEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "periods",
      id: id,
      meta: {
        getEndpoint: "periods",
      },
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPeriod} />;
}
