import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { getCandidateRecipientColumns } from "@/features/candidate-recipients/columns";
import { useIdentity } from "@/hooks/useIdentity";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { useGo } from "@refinedev/core";

export default function CandidateRecipientListPage() {
  const go = useGo();

  const { identity } = useIdentity();
  const isHeadOfOffice = identity?.role.includes("HEAD_OF_OFFICE");
  return (
    <DataTable
      label="Calon Penerima"
      resource={"candidate-recipients"}
      actionColumns={[
        ...(!isHeadOfOffice
          ? [ActionButton.Create, ActionButton.Edit, ActionButton.Delete]
          : []),
      ]}
      customRowActionButtons={
        isHeadOfOffice
          ? [
              {
                key: "give-assessment",
                label: "Beri Penilaian",
                icon: <ClipboardDocumentCheckIcon className="h-4 w-4" />,
                variant: "primary",
                isVisible(item) {
                  return item.isFilledCurrentPeriod !== true;
                },
                onPress(item) {
                  go({
                    to: `/penilaian/beri-penilaian/${item.id}`,
                    type: "push",
                  });
                },
              },
              {
                key: "assessment-history",
                label: "Riwayat Penilaian",
                icon: <ClipboardDocumentCheckIcon className="h-4 w-4" />,
                variant: "outline",
                onPress(item) {
                  go({
                    to: `/calon-penerima/riwayat-penilaian/${item.id}`,
                    type: "push",
                  });
                },
              },
            ]
          : [
              {
                key: "more-actions",
                isVertical: true,
                variant: "outline",
                menuItems: [
                  {
                    key: "assessment-history",
                    label: "Riwayat Penilaian",
                    onPress(item) {
                      go({
                        to: `/calon-penerima/riwayat-penilaian/${item.id}`,
                        type: "push",
                      });
                    },
                  },
                  {
                    key: "view-identity",
                    label: "Lihat Identitas",
                    onPress(item) {
                      go({
                        to: `/calon-penerima/identitas/${item.id}`,
                        type: "push",
                      });
                    },
                  },
                ],
              },
              {
                key: "give-assessment",
                label: "Beri Penilaian",
                icon: <ClipboardDocumentCheckIcon className="h-4 w-4" />,
                variant: "primary",
                isVisible(item) {
                  return item.isFilledCurrentPeriod !== true;
                },
                onPress(item) {
                  go({
                    to: `/penilaian/beri-penilaian/${item.id}`,
                    type: "push",
                  });
                },
              },
            ]
      }
      withSearch
      columns={getCandidateRecipientColumns(isHeadOfOffice ?? false)}
    />
  );
}
