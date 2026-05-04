import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { criteriaScaleColumns } from "@/features/criteria-scales/columns";
import { useIdentity } from "@/hooks/useIdentity";

export default function CriteriaScaleListPage() {
  const { identity } = useIdentity();

  const isHeadOfOffice = identity?.role.includes("HEAD_OF_OFFICE");

  return (
    <DataTable
      label="Skala Kriteria"
      resource={"criteria-scales"}
      actionColumns={[
        ...(!isHeadOfOffice
          ? [ActionButton.Create, ActionButton.Edit, ActionButton.Delete]
          : []),
      ]}
      withSearch
      columns={criteriaScaleColumns}
    />
  );
}
