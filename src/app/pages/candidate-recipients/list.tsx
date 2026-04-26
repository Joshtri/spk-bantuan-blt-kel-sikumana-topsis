import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { candidateRecipientColumns } from "@/features/candidate-recipients/columns";

export default function CandidateRecipientListPage() {
  return (
    <DataTable
      resource={"candidate-recipients"}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      withSearch
      columns={candidateRecipientColumns}
    />
  );
}
