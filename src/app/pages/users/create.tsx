import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { IUser } from "@/features/users/interfaces";
import { userTabs } from "@/features/users/tabs";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React, { useEffect } from "react";

export default function UserCreatePage() {
  const { params } = useParsed();
  const methods = useForm<IUser>({
    refineCoreProps: {
      resource: "users",
    },
  });

  const candidateRecipientIdFromQuery = params?.candidateRecipientId as string;

  useEffect(() => {
    if (candidateRecipientIdFromQuery) {
      methods.setValue("candidateRecipientId", candidateRecipientIdFromQuery);
    }
  }, [candidateRecipientIdFromQuery, methods]);

  return <CreateOrEditWrapper methods={methods} tabs={userTabs} />;
}
