import { useDelete, useInvalidate, useNavigation } from "@refinedev/core";

interface UseDataTableActionsOptions {
  resource: string;
}

interface UseDataTableActionsResult {
  handleCreate: () => void;
  handleEdit: (id: string | number) => void;
  handleShow: (id: string | number) => void;
  handleDelete: (id: string | number) => Promise<void>;
}

export function useDataTableActions({
  resource,
}: UseDataTableActionsOptions): UseDataTableActionsResult {
  const { create, edit, show } = useNavigation();
  const { mutateAsync: deleteAsync } = useDelete();
  const invalidate = useInvalidate();

  return {
    handleCreate: () => create(resource),
    handleEdit: (id) => edit(resource, id),
    handleShow: (id) => show(resource, id),
    handleDelete: async (id) => {
      await deleteAsync(
        {
          id,
          resource,
          successNotification: () => ({
            message: "Successfully deleted!",
            type: "success",
          }),
        },
        {
          onSuccess: () => {
            invalidate({
              resource,
              invalidates: ["list", "many"],
            });
          },
        },
      );
    },
  };
}
