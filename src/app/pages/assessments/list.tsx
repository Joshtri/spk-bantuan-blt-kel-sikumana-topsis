import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { assessmentColumns } from "@/features/assessments/columns";

export default function AssessmentListPage() {
  return (
    <DataTable
      resource={"assessments"}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      withSearch
      columns={assessmentColumns}
    />
  );
}
