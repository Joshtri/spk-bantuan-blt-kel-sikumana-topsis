import { useOne, useNavigation, useParsed, useGo } from "@refinedev/core";
import { Button, Card, Table, Chip } from "@heroui/react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { formatDate } from "@/utils/date";

interface AssessmentDetail {
  id: string;
  criteriaScaleId: string;
  scaleValue: number;
  category: string;
  criteriaName: string;
}

interface AssessmentResult {
  distancePositive: number;
  distanceNegative: number;
  preferenceValue: number;
  rank: number;
  isEligible: boolean;
}

interface AssessmentData {
  id: string;
  periodId: string;
  periodName: string;
  candidateId: string;
  candidateName: string;
  assessedByUserId: string;
  assessedByUsername: string;
  details: AssessmentDetail[];
  result: AssessmentResult;
}

export default function AssessmentCandidateHistoryShowPage() {
  const { id } = useParsed();
  const { list } = useNavigation();

  const go = useGo();
  const {
    result: assessmentData,
    query: { isLoading },
  } = useOne<AssessmentData>({
    resource: "assessments",
    id: id as string,
    queryOptions: {
      enabled: !!id,
    },
  });

  const assessment = assessmentData;

  if (!assessment) {
    return null;
  }

  const formatNumber = (value: number): string => {
    return Number(value).toFixed(4);
  };

  return (
    <div className="space-y-6 pb-12">
      <LoadingScreen isLoading={isLoading} />
      <Button
        variant="ghost"
        size="sm"
        onPress={() =>
          go({ to: `/calon-penerima/riwayat-penilaian/${assessment.candidateId}`, type: "push" })
        }
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </Button>

      {/* Header */}
      <div className="space-y-1">
        <Heading as="h1" size="lg">
          Detail Penilaian
        </Heading>
        <Text muted>
          {assessment.candidateName} • {assessment.periodName}
        </Text>
      </div>

      {/* Assessment Info */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Text muted>Calon Penerima</Text>
            <Text weight="semibold">{assessment.candidateName}</Text>
          </div>
          <div className="flex justify-between border-t border-default-100 pt-3">
            <Text muted>Periode</Text>
            <Text weight="semibold">{assessment.periodName}</Text>
          </div>
          <div className="flex justify-between border-t border-default-100 pt-3">
            <Text muted>Dinilai Oleh</Text>
            <Text weight="semibold">{assessment.assessedByUsername}</Text>
          </div>
        </div>
      </Card>

      {/* Criteria Details */}
      <Card className="p-6">
        <Heading as="h2" size="md" className="mb-4">
          Detail Kriteria
        </Heading>
        <Table>
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column isRowHeader>Kriteria</Table.Column>
                <Table.Column>Nilai</Table.Column>
                <Table.Column>Kategori</Table.Column>
              </Table.Header>
              <Table.Body>
                {assessment.details.map((detail) => (
                  <Table.Row key={detail.id}>
                    <Table.Cell>{detail.criteriaName}</Table.Cell>
                    <Table.Cell>
                      <Text weight="semibold">{detail.scaleValue}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="sm">{detail.category}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card>

      {/* TOPSIS Result */}
      <Card className="p-6">
        <Heading as="h2" size="md" className="mb-4">
          Hasil TOPSIS
        </Heading>
        <div className="space-y-3">
          <div className="flex justify-between">
            <Text muted>Jarak ke Solusi Positif (D⁺)</Text>
            <Text weight="semibold" className="font-mono">
              {formatNumber(assessment.result.distancePositive)}
            </Text>
          </div>
          <div className="flex justify-between border-t border-default-100 pt-3">
            <Text muted>Jarak ke Solusi Negatif (D⁻)</Text>
            <Text weight="semibold" className="font-mono">
              {formatNumber(assessment.result.distanceNegative)}
            </Text>
          </div>
          <div className="flex justify-between border-t border-default-100 pt-3">
            <Text muted>Nilai Preferensi (V)</Text>
            <Text weight="semibold" className="font-mono">
              {formatNumber(assessment.result.preferenceValue)}
            </Text>
          </div>
          <div className="flex justify-between border-t border-default-100 pt-3">
            <Text muted>Peringkat</Text>
            <Text weight="semibold">#{assessment.result.rank}</Text>
          </div>
          <div className="flex justify-between border-t border-default-100 pt-3">
            <Text muted>Status Kelayakan</Text>
            <Chip
              size="sm"
              color={assessment.result.isEligible ? "success" : "danger"}
              variant="soft"
            >
              {assessment.result.isEligible ? (
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
          </div>
        </div>
      </Card>
    </div>
  );
}
