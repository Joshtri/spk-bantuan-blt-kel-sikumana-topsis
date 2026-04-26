import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import DetailCriteria from "@/features/criterias/form/Detail";
import { ICriteria } from "@/features/criterias/interfaces";
import { tabsCriteria } from "@/features/criterias/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function CriteriaCreatePage() {
  const methods = useForm<ICriteria>({
    refineCoreProps: {
      resource: "criterias",
    },
    defaultValues: {
      name: "",
      weight: 0,
      code: "",
      criteria_type: "Cost",
    },
  });

  return (
    <>
      <CreateOrEditWrapper methods={methods} tabs={tabsCriteria} />
    </>
  );
}
