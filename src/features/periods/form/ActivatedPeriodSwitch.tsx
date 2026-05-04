import { Switch } from "@heroui/react";
import { useCustomMutation, useInvalidate } from "@refinedev/core";
import { IPeriod } from "../interfaces";
import LoadingScreen from "@/components/loading/LoadingScreen";

export function IsActiveSwitch({ item }: { item: IPeriod }) {
  const invalidate = useInvalidate();
  const { mutate, mutation } = useCustomMutation();

  const handleToggle = () => {
    mutate(
      {
        url: `/periods/${item.id}/toggle-active`,
        method: "patch",
        values: {},
      },
      {
        onSuccess: () => {
          invalidate({ resource: "periods", invalidates: ["list", "many"] });
        },
      },
    );
  };

  return (
    <>
      <LoadingScreen isLoading={mutation.isPending} />
      <Switch
        isSelected={item.isActive}
        onChange={handleToggle}
        size="sm"
        aria-label={`Toggle active status for ${item.name}`}
      >
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch>
    </>
  );
}
