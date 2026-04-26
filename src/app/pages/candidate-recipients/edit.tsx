import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsCandidateRecipient } from "@/features/candidate-recipients/tabs";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function CandidateRecipientEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "candidate-recipients",
      id: id,
      meta: {
        getEndpoint: "candidate-recipients",
      },
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsCandidateRecipient} />;
}
