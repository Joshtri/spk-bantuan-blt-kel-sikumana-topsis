import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { periodColumns } from "@/features/periods/columns";

export default function PeriodListPage() {
  return (
    <DataTable
      label="Periode"
      resource={"periods"}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      withSearch
      columns={periodColumns}
    />
  );
}
