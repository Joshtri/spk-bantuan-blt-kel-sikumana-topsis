import { AlertDialog } from "@/components/alert-dialog";
import { Button } from "@heroui/react";

interface CreateOrEditActionBarProps {
  isAllowSave?: boolean;
  isAllowDelete?: boolean;
  isAllowCancel?: boolean;
  isEditMode: boolean;
  isFormLoading: boolean;
  loading?: boolean;
  loadingDelete: boolean;
  onConfirmDelete: () => void | Promise<void>;
  onCancel: () => void;
}

export function CreateOrEditActionBar({
  isAllowSave = true,
  isAllowDelete = true,
  isAllowCancel = true,
  isEditMode,
  isFormLoading,
  loading = false,
  loadingDelete,
  onConfirmDelete,
  onCancel,
}: CreateOrEditActionBarProps) {
  return (
    <div className="flex items-center justify-between border-t-2 border-dashed border-default-100 bg-default-50/60 px-6 py-4 mt-1">
      {/* Primary actions */}
      <div className="flex items-center gap-2">
        {isAllowSave && (
          <Button
            variant="primary"
            type="submit"
            isPending={isFormLoading || loading}
            className="font-semibold"
          >
            Save
          </Button>
        )}
        {isAllowCancel && (
          <Button
            variant="secondary"
            onPress={onCancel}
            isDisabled={isFormLoading || loading}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Destructive action separated to the right */}
      {isAllowDelete && isEditMode && (
        <AlertDialog
          triggerLabel="Delete"
          triggerVariant="danger"
          title="Delete confirmation"
          description="Are you sure you want to delete this data?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="danger"
          onConfirm={onConfirmDelete}
          isDisabled={loadingDelete || isFormLoading}
        />
      )}
    </div>
  );
}
