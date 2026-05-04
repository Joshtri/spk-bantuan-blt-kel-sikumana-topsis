import CreateOrEditWrapper from "@/components/form/CreateOrEditWrapper";
import { ICriteria } from "@/features/criterias/interfaces";
import { tabsCriteria } from "@/features/criterias/tabs";
import { useForm } from "@refinedev/react-hook-form";
import { useCustom } from "@refinedev/core";
import { useEffect } from "react";

interface ApiResponse<T> {
  data: T;
}

interface ICodePosition {
  code: string;
}

export default function CriteriaCreatePage() {
  const methods = useForm<ICriteria>({
    refineCoreProps: {
      resource: "criterias",
    },
    defaultValues: {
      name: "",
      weight: 0,
      code: "",
      criteriaType: "Cost",
    },
  });

  const { result: codePositionData } = useCustom<ApiResponse<ICodePosition>>({
    url: "criterias/code-position",
    method: "get",
  });

  useEffect(() => {
    const code = codePositionData?.data?.data?.code;
    if (code) {
      methods.setValue("code", code);
    }
  }, [codePositionData, methods]);

  return (
    <CreateOrEditWrapper
      methods={methods}
      tabs={tabsCriteria()}
      title="Kriteria"
      listRoute="/kriteria"
    />
  );
}

