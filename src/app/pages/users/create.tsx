import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { userTabs } from "@/features/users/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function UserCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "users",
    },
  });
  return <CreateOrEditWrapper methods={methods} tabs={userTabs} />;
}
