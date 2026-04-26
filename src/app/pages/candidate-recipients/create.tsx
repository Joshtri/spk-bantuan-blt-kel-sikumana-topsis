import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsCandidateRecipient } from "@/features/candidate-recipients/tabs";
import { useForm } from "@refinedev/react-hook-form";

export default function CandidateRecipientCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "candidate-recipients",
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsCandidateRecipient} />;
}
