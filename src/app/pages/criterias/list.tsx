import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { criteriaColumns } from "@/features/criterias/columns";
import React from "react";

export default function CriteriaListPage() {
  return (
    <DataTable
      resource={"criterias"}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      withSearch
      columns={criteriaColumns}
    />
  );
}
