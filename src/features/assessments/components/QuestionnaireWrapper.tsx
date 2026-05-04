import { useState } from "react";
import { QuestionnaireForm } from "./QuestionnaireForm";
import { QuestionnaireStartPage } from "./QuestionnaireStartPage";

interface QuestionnaireWrapperProps {
  candidateId: string;
}

export function QuestionnaireWrapper({
  candidateId,
}: QuestionnaireWrapperProps) {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return (
      <QuestionnaireStartPage
        candidateId={candidateId}
        onStart={() => {
          setHasStarted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return <QuestionnaireForm candidateId={candidateId} />;
}
