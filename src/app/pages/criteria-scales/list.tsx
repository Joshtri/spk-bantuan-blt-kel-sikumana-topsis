import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { criteriaScaleColumns } from "@/features/criteria-scales/columns";

export default function CriteriaScaleListPage() {
  return (
    <DataTable
      resource={"criteria-scales"}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      withSearch
      columns={criteriaScaleColumns}
    />
  );
}
