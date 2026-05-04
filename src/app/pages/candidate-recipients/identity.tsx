import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { tabsCandidateRecipient } from "@/features/candidate-recipients/tabs";
import { useIdentity } from "@/hooks/useIdentity";
import { useOne, useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function IdentityCandidatePage() {
  const { id } = useParsed();
  const { identity } = useIdentity();
  const isHeadOfOffice = identity?.role.includes("HEAD_OF_OFFICE");

  const { result } = useOne({
    id: id as string,
    resource: "candidate-recipients",
  });

  return (
    <CreateOrEditWrapper
      isAllowDelete={!isHeadOfOffice}
      isShow
      tabs={tabsCandidateRecipient}
    />
  );
}
