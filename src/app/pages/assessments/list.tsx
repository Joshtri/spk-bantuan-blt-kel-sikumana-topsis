import DataTable from "@/components/table";
import { ActionButton } from "@/components/table/types";
import { getCandidateRecipientColumns } from "@/features/candidate-recipients/columns";
import { IPeriod } from "@/features/periods/interfaces";
import { ApiResponse } from "@/interfaces/IBaseEntity";
import { formatDate } from "@/utils/date";
import { useCustom, useDelete, useGo, useInvalidate } from "@refinedev/core";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import type { ICandidateRecipient } from "@/features/candidate-recipients/interfaces";
import { useIdentity } from "@/hooks/useIdentity";

export default function AssessmentListPage() {
  const go = useGo();
  const { mutateAsync: deleteAsync } = useDelete();
  const invalidate = useInvalidate();
  const {
    result,
    query: { isLoading: isPeriodCurrentaActiveLoading },
  } = useCustom<ApiResponse<IPeriod>>({
    url: "periods/current-active",
    method: "get",
  });

  const { identity } = useIdentity();
  const isHeadOfOffice = identity?.role.includes("HEAD_OF_OFFICE");

  const periodName = result?.data?.data?.name ?? "Tidak ada periode aktif";
  const startDate = result?.data?.data?.startDate
    ? formatDate(result?.data?.data?.startDate)
    : "";
  const endDate = result?.data?.data?.endDate
    ? formatDate(result?.data?.data?.endDate)
    : "";

  const description = isPeriodCurrentaActiveLoading
    ? "Memuat data periode..."
    : `Penilaian calon penerima bantuan pada periode saat ini (${periodName}) ${startDate} - ${endDate}`;

  const handleDeleteAssessment = async (item: ICandidateRecipient) => {
    if (!item.assessmentId) return;
    await deleteAsync(
      {
        resource: "assessments",
        id: item.assessmentId,
        successNotification: () => ({
          message: "Penilaian berhasil dihapus",
          type: "success",
        }),
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "candidate-recipients",
            invalidates: ["list", "many"],
          });
        },
      },
    );
  };

  return (
    <DataTable
      description={description}
      resource={"candidate-recipients"}
      label="Penilaian"
      actionColumns={[...(!isHeadOfOffice ? [ActionButton.Delete] : [])]}
      onActionPress={{
        delete: handleDeleteAssessment,
      }}
      customRowActionButtons={[
        {
          key: "give-assessment",
          label: "Beri Penilaian",
          icon: <ClipboardDocumentCheckIcon className="h-4 w-4" />,
          variant: "primary",
          isVisible(item) {
            return !isHeadOfOffice && item.isFilledCurrentPeriod !== true;
          },
          onPress(item) {
            go({
              to: `/penilaian/beri-penilaian/${item.id}`,
              type: "push",
            });
          },
        },

        {
          key: "view-assessment",
          label: "Lihat Penilaian",
          icon: <ClipboardDocumentCheckIcon className="h-4 w-4" />,
          variant: "outline",
          isVisible: (item) => item.isFilledCurrentPeriod === true,
          onPress(item) {
            go({
              to: `/penilaian/show/${item.id}`,
              type: "push",
            });
          },
        },
      ]}
      withSearch
      columns={getCandidateRecipientColumns(isHeadOfOffice ?? false)}
    />
  );
}
