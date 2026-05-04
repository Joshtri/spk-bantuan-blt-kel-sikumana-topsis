import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsCriteriaScale } from "@/features/criteria-scales/tabs";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect } from "react";

export default function CriteriaScaleCreatePage() {
  const { params } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "criteria-scales",
    },
  });

  const criteriaIdFromQuery = params?.criteriaId as string | undefined;

  useEffect(() => {
    if (criteriaIdFromQuery) {
      methods.setValue("criteriaId", criteriaIdFromQuery);
    }
  }, [criteriaIdFromQuery, methods]);

  return <CreateOrEditWrapper methods={methods} tabs={tabsCriteriaScale} />;
}
