import { Card, Tabs } from "@heroui/react";
import {
  useBack,
  useDelete,
  useGo,
  useInvalidate,
  useOne,
  useParsed,
  useResourceParams,
} from "@refinedev/core";
import { PropsWithChildren, useEffect, useState } from "react";
import type { ErrorOption, FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import type { ApiMessageResponse } from "../../interfaces/IBaseEntity";
import { LoadingScreen } from "../loading/LoadingScreen";
import { CreateOrEditActionBar } from "./CreateOrEditActionBar";
import { CreateOrEditHeader } from "./CreateOrEditHeader";
import { FormWrapper, type FormWrapperProps } from "./FormWrapper";
import { useNavigate as useNavigateRouter } from "react-router";
import { FormModeProvider } from "@/contexts/FormModeContext";

function ShowFormProvider({
  resource,
  id,
  children,
}: PropsWithChildren<{ resource?: string; id?: string | number }>) {
  const methods = useForm();
  const {
    result,
    query: { isFetching },
  } = useOne({
    resource: resource ?? "",
    id: id ?? "",
    queryOptions: { enabled: !!resource && !!id },
  });

  useEffect(() => {
    if (result) {
      methods.reset(result as FieldValues);
    }
  }, [result, methods]);

  if (isFetching) return <LoadingScreen />;

  return (
    <FormModeProvider value={{ isShow: true }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </FormModeProvider>
  );
}

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface CreateOrEditWrapperProps<T> extends Omit<
  FormWrapperProps,
  "methods"
> {
  methods?: FormWrapperProps["methods"];
  title?: string;
  tabs?: TabItem[];
  isAllowSave?: boolean;
  isAllowDelete?: boolean;
  loading?: boolean;
  isAllowCancel?: boolean;
  isShow?: boolean;
  onSave?: (data: T) => Promise<void>;
  onDelete?: () => Promise<void>;
  withBackButton?: boolean;
  resource?: string;
  listRoute?: string;
  deleteResource?: string;
  withPrefixTitle?: boolean;
  isEdit?: boolean;
  isShowCreatedOrModified?: boolean;
  onValidate?: (
    data: T,
    setError: (
      name: string,
      error: ErrorOption,
      options?: { shouldFocus: boolean },
    ) => void,
  ) => Promise<boolean>;
}

const CreateOrEditWrapper = <T,>({
  children,
  tabs,
  title,
  isAllowSave: isAllowSaveProp = true,
  isAllowDelete = true,
  loading = false,
  isAllowCancel = true,
  isShow = false,
  onSave,
  onDelete,
  withBackButton = true,
  resource: resourceProp,
  listRoute: listRouteProp,
  deleteResource,
  withPrefixTitle = true,
  isEdit = false,
  isShowCreatedOrModified: _isShowCreatedOrModified = true,
  onValidate,
  ...formWrapperProps
}: CreateOrEditWrapperProps<T>) => {
  const { methods } = formWrapperProps;
  const go = useGo();
  const back = useBack();
  const navigate = useNavigateRouter();
  const { resource } = useResourceParams();
  const { id } = useParsed();
  const invalidate = useInvalidate();

  // In show mode save is always hidden
  const isAllowSave = isShow ? false : isAllowSaveProp;

  const firstTab = tabs?.[0]?.label;
  const [selectedTab, setSelectedTab] = useState<string>(firstTab ?? "");

  const resourceName = resourceProp ?? resource?.name;
  const isEditMode = Boolean(id || isEdit);
  const effectiveTitle = [
    withPrefixTitle ? (isShow ? "Detail" : isEditMode ? "Edit" : "Create") : "",
    title ?? resource?.meta?.label ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const listRoute = listRouteProp ?? resource?.list?.toString() ?? "";

  const {
    mutateAsync: deleteAsync,
    mutation: { isPending: loadingDelete },
  } = useDelete<ApiMessageResponse>();

  const isFormLoading =
    methods && "refineCore" in methods
      ? Boolean(
          methods.refineCore.query?.isFetching ||
          methods.refineCore.mutation?.isPending,
        )
      : false;

  const navigateToList = () => {
    if (listRoute) {
      navigate(listRoute, { replace: true });
    } else if (resourceName) {
      go({ to: { resource: resourceName, action: "list" }, type: "replace" });
    } else {
      back();
    }
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete();
      return;
    }
    if (!id) return;
    await deleteAsync(
      {
        id: id.toString(),
        resource: deleteResource ?? resourceName ?? "",
        successNotification: () => ({
          message: "Successfully deleted!",
          type: "success",
        }),
      },
      {
        onSuccess: () => {
          invalidate({
            resource: resourceName ?? "",
            invalidates: ["list", "many"],
          });
          navigateToList();
        },
      },
    );
  };

  const submitHandler = async (data: FieldValues) => {
    if (!methods) return;
    if (id) data.id = id.toString();

    if (onValidate) {
      const isValid = await onValidate(data as T, methods.setError);
      if (!isValid) return;
    }

    if (onSave) {
      await onSave(data as T);
    } else if ("refineCore" in methods) {
      await methods.refineCore.onFinish(data);
    }

    await invalidate({
      resource: resourceName ?? "",
      invalidates: ["list", "many"],
    });
    navigateToList();
  };

  const cardContent = (
    <div className="flex flex-col gap-5">
      <CreateOrEditHeader
        title={effectiveTitle}
        withBackButton={withBackButton}
        onBack={navigateToList}
      />

      <Card className="overflow-hidden border border-default-100 shadow-sm">
        {tabs && tabs.length > 0 ? (
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            <Card.Header className=" border-default-100 pb-0">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Form sections" className="">
                  {tabs.map((tab, index) => (
                    <Tabs.Tab key={tab.label} id={tab.label}>
                      {index > 0 && <Tabs.Separator />}
                      {tab.label}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
            </Card.Header>

            <div className="border-t-2 border-dashed border-default-100 bg-default-50/60 px-6" />

            <Card.Content className="pt-0">
              {tabs.map((tab) => (
                <Tabs.Panel key={tab.label} id={tab.label} className="p-0">
                  {tab.content}
                </Tabs.Panel>
              ))}
            </Card.Content>
          </Tabs>
        ) : (
          <Card.Content className="px-6 py-6">{children}</Card.Content>
        )}

        <CreateOrEditActionBar
          isAllowSave={isAllowSave}
          isAllowDelete={isAllowDelete}
          isAllowCancel={isAllowCancel}
          isEditMode={isEditMode}
          isFormLoading={isFormLoading}
          loading={loading}
          loadingDelete={loadingDelete}
          onConfirmDelete={handleConfirmDelete}
          onCancel={back}
        />
      </Card>

      {(loading || isFormLoading || loadingDelete) && <LoadingScreen />}
    </div>
  );

  if (isShow || !methods) {
    return (
      <ShowFormProvider resource={resourceName} id={id}>
        {cardContent}
      </ShowFormProvider>
    );
  }

  return (
    <FormWrapper
      submitHandler={submitHandler}
      methods={methods}
      className={formWrapperProps.className}
    >
      {cardContent}
    </FormWrapper>
  );
};

export default CreateOrEditWrapper;
