import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsCriteria } from "@/features/criterias/tabs";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function CriteriaEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "criterias",
      id: id,
      meta: {
        getEndpoint: "criterias",
      },
    },
  });

  return (
    <CreateOrEditWrapper
      methods={methods}
      tabs={tabsCriteria()}
      title="Kriteria"
      listRoute="/kriteria"
      isEdit
    />
  );
}
