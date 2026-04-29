import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsCriteriaScale } from "@/features/criteria-scales/tabs";
import { useForm } from "@refinedev/react-hook-form";

export default function CriteriaScaleCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "criteria-scales",
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsCriteriaScale} />;
}
