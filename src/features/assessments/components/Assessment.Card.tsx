import { Card, Chip, Separator } from "@heroui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import type {
  IAssessment,
  IAssessmentResult,
} from "@/features/assessments/interfaces";
import { AssessmentDetailTable } from "./AssessmentDetailTable";

interface AssessmentCardProps {
  assessment: IAssessment;
}

function AssessmentResultBadge({ result }: { result: IAssessmentResult }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <Text as="small" size="xs" muted>
          Preference Value
        </Text>
        <div className="text-lg font-bold text-primary">
          {result.preferenceValue.toFixed(4)}
        </div>
      </div>
      <div className="text-right">
        <Text as="small" size="xs" muted>
          Rank
        </Text>
        <div className="text-lg font-bold text-default-800">#{result.rank}</div>
      </div>
      <Chip
        size="sm"
        color={result.isEligible ? "success" : "danger"}
        variant="soft"
      >
        {result.isEligible ? (
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
  );
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  const result: IAssessmentResult | undefined = assessment.result;

  return (
    <Card>
      <Card.Header className="flex flex-row items-center justify-between gap-4 p-5">
        <div className="space-y-1">
          <Heading as="h3" size="md">
            Penilaian Pada Periode : {assessment.periodName}
          </Heading>
          <Text size="xs" muted>
            Dinilai oleh:{" "}
            <span className="font-medium text-default-700">
              {assessment.assessedByUsername}
            </span>
          </Text>
        </div>

        {result ? (
          <AssessmentResultBadge result={result} />
        ) : (
          <Chip size="sm" color="warning" variant="soft">
            Belum Dihitung
          </Chip>
        )}
      </Card.Header>

      {assessment.details.length > 0 && (
        <>
          <Separator />
          <Card.Content className="p-0">
            <AssessmentDetailTable details={assessment.details} />
          </Card.Content>
        </>
      )}
    </Card>
  );
}
