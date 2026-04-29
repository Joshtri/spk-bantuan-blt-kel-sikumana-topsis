import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsAssessment } from "@/features/assessments/tabs";
import { useForm } from "@refinedev/react-hook-form";
import type { FieldValues } from "react-hook-form";

export default function AssessmentCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "assessments",
    },
  });

  const handleSave = async (data: FieldValues) => {
    const criteriaScaleIds = Object.entries(data)
      .filter(([key]) => key.startsWith("criteriaScale_"))
      .map(([, value]) => value as string)
      .filter(Boolean);

    await methods.refineCore.onFinish({
      periodId: data.periodId,
      candidateId: data.candidateId,
      assessedByUserId: data.assessedByUserId,
      criteriaScaleIds,
    });
  };

  return (
    <CreateOrEditWrapper methods={methods} tabs={tabsAssessment} onSave={handleSave} />
  );
}
