import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { usersColumns } from "@/features/users/columns";
import React from "react";

export default function UsersListPage() {
  return (
    <DataTable
      resource={"users"}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      columns={usersColumns}
    />
  );
}
