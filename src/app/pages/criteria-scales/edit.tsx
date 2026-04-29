import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsCriteriaScale } from "@/features/criteria-scales/tabs";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function CriteriaScaleEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "criteria-scales",
      id: id,
      meta: {
        getEndpoint: "criteria-scales",
      },
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsCriteriaScale} />;
}
