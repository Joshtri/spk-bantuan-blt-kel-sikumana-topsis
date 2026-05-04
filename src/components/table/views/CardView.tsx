import { Button, Card, Dropdown } from "@heroui/react";
import {
  PencilIcon,
  EyeIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import type { BaseRecord } from "@refinedev/core";
import { ActionButton } from "../types";
import type { ColumnTable, CustomRowActionButton } from "../types";
import { AlertDialog } from "@/components/alert-dialog";

interface CardViewProps<T extends BaseRecord> {
  rows: T[];
  columns: ColumnTable<T>[];
  actionColumns: ActionButton[];
  customRowActionButtons?: CustomRowActionButton<T>[];
  onEdit: (id: string | number) => void;
  onShow: (id: string | number) => void;
  onDelete: (row: T) => void;
}

export function CardView<T extends BaseRecord>({
  rows,
  columns,
  actionColumns,
  customRowActionButtons = [],
  onEdit,
  onShow,
  onDelete,
}: CardViewProps<T>) {
  const hasRowActions =
    actionColumns.some((a) =>
      [ActionButton.Edit, ActionButton.Show, ActionButton.Delete].includes(a),
    ) || customRowActionButtons.length > 0;

  const getColumnValue = (row: T, column: ColumnTable<T>) => {
    if (column.render) return column.render(row);
    if (column.valueGetter) return column.valueGetter(row);
    return String(row[column.key] ?? "-");
  };

  const rowsArray = Array.isArray(rows) ? rows : [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
      {rowsArray.map((row) => {
        const firstColumn = columns[0];
        const otherColumns = columns.filter(
          (col) => col.key !== firstColumn?.key && col.key !== "actions",
        );

        return (
          <Card
            key={String(row.id)}
            className="border border-default-100 shadow-sm transition-shadow hover:shadow-md"
          >
            <Card.Content className="p-4">
              {/* Header - First column as title */}
              <div className="mb-3 border-b border-default-100 pb-3">
                <h3 className="text-base font-semibold text-gray-800">
                  {firstColumn ? getColumnValue(row, firstColumn) : String(row.id)}
                </h3>
              </div>

              {/* Other columns as key-value pairs */}
              <div className="space-y-2">
                {otherColumns.map((column) => (
                  <div
                    key={column.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-500">{column.title}</span>
                    <span className="font-medium text-gray-800">
                      {getColumnValue(row, column)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {hasRowActions && (
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-default-100 pt-3">
                  {actionColumns.includes(ActionButton.Edit) && (
                    <Button
                      variant="outline"
                      isIconOnly
                      size="sm"
                      aria-label="Edit"
                      onPress={() => onEdit(row.id as string | number)}
                    >
                      <PencilIcon className="h-3 w-3" />
                    </Button>
                  )}
                  {actionColumns.includes(ActionButton.Show) && (
                    <Button
                      variant="outline"
                      isIconOnly
                      size="sm"
                      aria-label="View"
                      onPress={() => onShow(row.id as string | number)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {actionColumns.includes(ActionButton.Delete) && (
                    <AlertDialog
                      triggerLabel="Delete"
                      triggerContent={<TrashIcon className="h-4 w-4" />}
                      triggerIsIconOnly
                      triggerAriaLabel="Delete"
                      title="Delete confirmation"
                      description="Are you sure you want to delete this data?"
                      confirmLabel="Delete"
                      cancelLabel="Cancel"
                      confirmVariant="danger"
                      onConfirm={() => onDelete(row as T)}
                    />
                  )}
                  {customRowActionButtons.map((btn) => {
                    if (btn.isVisible && !btn.isVisible(row)) return null;
                    const disabled = btn.isDisabled?.(row) ?? false;
                    if (btn.isVertical) {
                      const items = (btn.menuItems ?? []).filter(Boolean);
                      if (items.length === 0) return null;
                      return (
                        <Dropdown key={btn.key}>
                          <Dropdown.Trigger>
                            <Button
                              variant={btn.variant ?? "outline"}
                              isIconOnly
                              size="sm"
                              isDisabled={disabled}
                              aria-label={
                                btn.ariaLabel ?? btn.label ?? "More actions"
                              }
                            >
                              {btn.icon ?? (
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </Dropdown.Trigger>
                          <Dropdown.Popover>
                            <Dropdown.Menu
                              aria-label={btn.label ?? "Row actions"}
                            >
                              {items.map((item) => (
                                <Dropdown.Item
                                  key={item.key}
                                  id={item.key}
                                  isDisabled={item.isDisabled}
                                  onPress={() => {
                                    void item.onPress?.(row);
                                  }}
                                >
                                  <span className="flex items-center gap-2">
                                    {item.icon}
                                    {item.label}
                                  </span>
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                        </Dropdown>
                      );
                    }
                    return (
                      <Button
                        key={btn.key}
                        variant={btn.variant ?? "outline"}
                        isIconOnly={!btn.label}
                        size="sm"
                        isDisabled={disabled}
                        aria-label={btn.ariaLabel ?? btn.label ?? btn.key}
                        onPress={() => {
                          void btn.onPress?.(row);
                        }}
                      >
                        {btn.icon}
                        {btn.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </Card.Content>
          </Card>
        );
      })}
    </div>
  );
}
