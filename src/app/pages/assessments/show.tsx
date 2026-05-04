import { useList, useNavigation, useParsed } from "@refinedev/core";
import { Button, Card, Chip, Separator } from "@heroui/react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import LoadingScreen from "@/components/loading/LoadingScreen";
import type {
  IAssessment,
  IAssessmentResult,
} from "@/features/assessments/interfaces";
import EmptyState from "@/components/empty-state";
import { AssessmentCard } from "@/features/assessments/components/Assessment.Card";

export default function AssessmentShowPage() {
  const { id } = useParsed();
  const { list } = useNavigation();

  const {
    result: assessmentsResult,
    query: { isLoading: isLoadingAssessments },
  } = useList<IAssessment>({
    resource: "assessments",
    meta: { params: { candidateId: id, activePeriodOnly: true } },
    pagination: { pageSize: 100 },
  });

  const assessments: IAssessment[] = assessmentsResult?.data ?? [];
  const candidateName = assessments[0]?.candidateName ?? "—";

  return (
    <div className="mx-auto max-w-full space-y-6 pb-12">
      <LoadingScreen isLoading={isLoadingAssessments} />
      <Button variant="ghost" size="sm" onPress={() => list("assessments")}>
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </Button>

      {/* Candidate header - simplified */}
      <div className="space-y-1">
        <Heading as="h1" size="lg">
          Nama Calon Penerima : {candidateName}
        </Heading>
      </div>

      {/* Assessment list */}
      {assessments.length === 0 && !isLoadingAssessments ? (
        <EmptyState>
          <EmptyState.Media>
            <ClipboardDocumentCheckIcon className="h-12 w-12" />
          </EmptyState.Media>
          <EmptyState.Title>Belum ada penilaian</EmptyState.Title>
          <EmptyState.Description>
            Calon penerima ini belum dinilai pada periode aktif saat ini.
          </EmptyState.Description>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </div>
      )}
    </div>
  );
}
