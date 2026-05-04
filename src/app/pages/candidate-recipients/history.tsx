import { useCustom, useGo, useNavigation, useParsed } from "@refinedev/core";
import { Button, Chip } from "@heroui/react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { ApiResponse } from "@/interfaces/IBaseEntity";
import { formatDate } from "@/utils/date";
import DataTable from "@/components/table";
import type { ColumnTable } from "@/components/table/types";

interface AssessmentHistoryItem {
  id: string;
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

interface CandidateHistoryData {
  candidateId: string;
  candidateName: string;
  history: AssessmentHistoryItem[];
}

export default function CandidateHistoryAssessmentPage() {
  const { id } = useParsed();
  const { list } = useNavigation();

  const go = useGo();
 

  const columns: ColumnTable<AssessmentHistoryItem>[] = [
    {
      key: "periodName",
      title: "Periode",
      render: (item) => (
        <div className="space-y-0.5">
          <Text weight="semibold">{item.periodName}</Text>
          <Text as="small" size="xs" muted>
            {formatDate(item.periodStartDate)} –{" "}
            {formatDate(item.periodEndDate)}
          </Text>
        </div>
      ),
    },
    {
      key: "assessmentDate",
      title: "Tanggal Penilaian",
      render: (item) => (
        <Text size="sm">{formatDate(item.assessmentDate)}</Text>
      ),
    },
    {
      key: "assessedByName",
      title: "Dinilai Oleh",
      valueGetter: (item) => item.assessedByName,
    },
    {
      key: "preferenceValue",
      title: "Nilai Preferensi",
      align: "end",
      render: (item) => (
        <Text size="sm" className="font-mono">
          {item.preferenceValue.toFixed(4)}
        </Text>
      ),
    },
    {
      key: "rank",
      title: "Rank",
      align: "end",
      render: (item) => (
        <Text weight="semibold" size="sm">
          #{item.rank}
        </Text>
      ),
    },
    {
      key: "isEligible",
      title: "Status",
      render: (item) => (
        <Chip
          size="sm"
          color={item.isEligible ? "success" : "danger"}
          variant="soft"
        >
          {item.isEligible ? (
            <span className="flex items-center gap-1">
              <CheckCircleIcon className="h-3.5 w-3.5" />
              Layak
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <XCircleIcon className="h-3.5 w-3.5" />
              Tidak Layak
            </span>
          )}
        </Chip>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mx-auto max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          onPress={() => list("candidate-recipients")}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <DataTable
        resource={`candidate-recipients/${id}/assessment-history`}
        columns={columns}
        label="Riwayat Penilaian"
        customRowActionButtons={[
          {
            key: "view-assessment",
            label: "Lihat Jawaban Penilaian",
            onPress(item) {
              go({
                to: `/calon-penerima/jawaban/${item.assessmentId}/`,
                type: "push",
              });
            },
          },
        ]}
      />
    </div>
  );
}
