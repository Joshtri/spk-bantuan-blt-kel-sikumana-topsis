import { useIdentity } from "@/hooks/useIdentity";
import { useState } from "react";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { Heading } from "@/components/heading";
import { useGo, useOne } from "@refinedev/core";
import { ICandidateRecipient } from "@/features/candidate-recipients/interfaces";
import UserInformation from "@/features/users/profiles/UserInformation";
import CandidateInformation from "@/features/users/profiles/CandidateInformation";
import ChangePasswordDialog from "@/features/users/profiles/ChangePasswordDialog";
import { Button } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// import UserInfoCard from "@/components/UserInfoCard";
// import CandidateInfoCard from "@/components/CandidateInfoCard";

export default function MyProfilePage() {
  const { identity, isLoading } = useIdentity();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const go = useGo();

  const {
    result: candidateData,
    query: { isLoading: isCandidateDataLoading },
  } = useOne<ICandidateRecipient>({
    resource: "candidate-recipients",
    id: identity?.candidateRecipientId || "",
    queryOptions: {
      enabled: !!identity?.candidateRecipientId,
    },
  });

  if (isLoading || isCandidateDataLoading)
    return <LoadingScreen isLoading={isLoading || isCandidateDataLoading} />;

  if (!identity) {
    return <div className="p-6">User not found</div>;
  }

  const { username, email, role, id, candidateRecipientId } = identity;

  return (
    <div className="p-4 flex flex-col gap-4">
      <Heading size="2xl" as="h5" align="left" weight="semibold">
        My Profile
      </Heading>

      <Button
        variant="ghost"
        size="sm"
        onPress={() => go({ to: `/`, type: "push" })}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </Button>

      <UserInformation
        id={id}
        username={username}
        email={email}
        role={role}
        candidateRecipientId={candidateRecipientId ?? undefined}
        onChangePasswordClick={() => setIsChangePasswordOpen(true)}
      />

      {candidateData && <CandidateInformation candidate={candidateData} />}

      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </div>
  );
}
