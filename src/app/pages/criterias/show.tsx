import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsCriteria } from "@/features/criterias/tabs";
import { useIdentity } from "@/hooks/useIdentity";
import { useOne, useParsed } from "@refinedev/core";
import React from "react";

export default function CriteriaShowPage() {
  const { id } = useParsed();
  const { identity } = useIdentity();
  const isHeadOfOffice = identity?.role.includes("HEAD_OF_OFFICE");

  const { result } = useOne({
    id: id as string,
    resource: "criterias",
  });

  return (
    <CreateOrEditWrapper
      isAllowDelete={!isHeadOfOffice}
      isShow
      tabs={tabsCriteria(true)}
    />
  );
}
