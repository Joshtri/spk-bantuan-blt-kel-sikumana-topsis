import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsAssessment } from "@/features/assessments/tabs";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import type { FieldValues } from "react-hook-form";

export default function AssessmentEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "assessments",
      id: id,
    },
  });

  const handleSave = async (data: FieldValues) => {
    const criteriaScaleIds = Object.entries(data)
      .filter(([key]) => key.startsWith("criteriaScale_"))
      .map(([, value]) => value as string)
      .filter(Boolean);

    await methods.refineCore.onFinish({
      assessedByUserId: data.assessedByUserId,
      criteriaScaleIds,
    });
  };

  return (
    <CreateOrEditWrapper methods={methods} tabs={tabsAssessment} onSave={handleSave} />
  );
}
