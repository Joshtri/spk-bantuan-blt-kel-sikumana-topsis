import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { criteriaColumns } from "@/features/criterias/columns";
import { ICriteria } from "@/features/criterias/interfaces";
import { useIdentity } from "@/hooks/useIdentity";
import React from "react";

export default function CriteriaListPage() {
  const { identity } = useIdentity();
  const isHeadOfOffice = identity?.role.includes("HEAD_OF_OFFICE");
  return (
    <DataTable<ICriteria>
      resource={"criterias"}
      actionColumns={[
        ...(!isHeadOfOffice
          ? [ActionButton.Create, ActionButton.Edit, ActionButton.Delete]
          : []),

        ActionButton.Show,
      ]}
      withSearch
      columns={criteriaColumns}
      label="Kriteria"
    />
  );
}
