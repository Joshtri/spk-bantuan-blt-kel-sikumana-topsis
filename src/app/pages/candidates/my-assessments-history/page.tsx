import { Chip } from "@heroui/react";
import DataTable from "@/components/table";
import { ActionButton, ColumnTable } from "@/components/table/types";
import { useIdentity } from "@/hooks/useIdentity";
import { useGo } from "@refinedev/core";

interface IAssessmentHistoryItem {
  assessmentId: string;
  periodId: string;
  periodName: string;
  periodStartDate: string;
  periodEndDate: string;
  preferenceValue: number;
  rank: number;
  isEligible: boolean;
  assessmentDate: string;
  assessedByName: string;
}

const columns: ColumnTable<IAssessmentHistoryItem>[] = [
  {
    key: "periodName",
    title: "Periode",
  },
  {
    key: "periodStartDate",
    title: "Tanggal Mulai",
    valueGetter: (item) =>
      new Date(item.periodStartDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    key: "periodEndDate",
    title: "Tanggal Selesai",
    valueGetter: (item) =>
      new Date(item.periodEndDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    key: "preferenceValue",
    title: "Nilai Preferensi",
    align: "center",
    valueGetter: (item) => item.preferenceValue.toFixed(4),
  },
  {
    key: "rank",
    title: "Peringkat",
    align: "center",
  },
  {
    key: "isEligible",
    title: "Status",
    align: "center",
    render: (item) => (
      <Chip
        color={item.isEligible ? "success" : "danger"}
        size="sm"
        variant="soft"
      >
        {item.isEligible ? "Layak" : "Tidak Layak"}
      </Chip>
    ),
  },
  {
    key: "assessmentDate",
    title: "Tanggal Penilaian",
    valueGetter: (item) =>
      new Date(item.assessmentDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    key: "assessedByName",
    title: "Dinilai Oleh",
  },
];

export default function MyAssessmentsHistoryPage() {
  const { identity } = useIdentity();

  const go = useGo();

  return (
    <DataTable<IAssessmentHistoryItem>
      description="Berikut adalah riwayat penilaian yang telah Anda lakukan pada periode-periode sebelumnya."
      customRowActionButtons={[
        {
          key: "show",
          label: "Lihat Detail",
          variant: "outline",
          onPress: (item) => {
            // Navigate to show page with assessmentId
            go({
              to: `/history-penilaian/show/${item.assessmentId}`,
            });
          },
        },
      ]}
      resource={`candidate-recipients/${identity?.candidateRecipientId}/assessment-history`}
      columns={columns}
      label="Riwayat Penilaian Saya"
      withSearch
    />
  );
}
