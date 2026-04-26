import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { userTabs } from "@/features/users/tabs";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function UserEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "users",
      id: id,
      meta: {
        getEndpoint: "users",
      },
    },
  });
  return <CreateOrEditWrapper methods={methods} tabs={userTabs} />;
}
