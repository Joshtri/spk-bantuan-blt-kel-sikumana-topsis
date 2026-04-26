import { useMemo, useState } from "react";
import { type BaseRecord } from "@refinedev/core";
import {
  Button,
  cn,
  EmptyState,
  Pagination,
  Spinner,
  Table,
} from "@heroui/react";
import {
  PencilIcon,
  EyeIcon,
  TrashIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

import {
  ActionButton,
  type ActionButtonHandlerMap,
  type ColumnTable,
  type CustomActionButton,
  type CustomFilter,
} from "./types";
import { useDataTableData } from "./hooks/useDataTableData";
import { useDataTableActions } from "./hooks/useDataTableActions";
import { TableToolbar } from "./TableToolbar";
import { AlertDialog } from "@/components/alert-dialog";

/** Returns page numbers to render, with null representing an ellipsis. */
function buildPageItems(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | null)[] = [1];
  if (current > 3) items.push(null);
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    items.push(p);
  }
  if (current < total - 2) items.push(null);
  items.push(total);
  return items;
}

// Actions that belong to each row (not toolbar-level)
const ROW_ACTION_BUTTONS: ActionButton[] = [
  ActionButton.Edit,
  ActionButton.Show,
  ActionButton.Delete,
  ActionButton.Review,
  ActionButton.Copy,
];

interface DataTableProps<T extends BaseRecord> {
  resource: string;
  columns: ColumnTable<T>[];
  actionColumns?: ActionButton[];
  label?: string;
  pageSize?: number;
  withSearch?: boolean;
  customActionButtons?: CustomActionButton[];
  customFilters?: CustomFilter<T>[];
  onActionPress?: Partial<ActionButtonHandlerMap<T>>;
}

export default function DataTable<T extends BaseRecord>({
  resource,
  columns,
  actionColumns = [],
  label,
  pageSize = 10,
  withSearch = false,
  customActionButtons = [],
  customFilters = [],
  onActionPress,
}: DataTableProps<T>) {
  const {
    rows,
    total,
    totalPages,
    page,
    pageSize: ps,
    setPage,
    isLoading,
    isError,
  } = useDataTableData<T>({ resource, pageSize });

  const { handleCreate, handleEdit, handleShow, handleDelete } =
    useDataTableActions({ resource });

  const [searchValue, setSearchValue] = useState("");
  const [filterValues, setFilterValues] = useState<
    Record<string, Set<string | boolean>>
  >({});

  const handleExport = async () => {
    await onActionPress?.[ActionButton.Export]?.(rows as T[]);
  };
  const handleImport = async () => {
    await onActionPress?.[ActionButton.Import]?.(rows as T[]);
  };

  const handleConfirmDelete = async (row: T) => {
    if (onActionPress?.[ActionButton.Delete]) {
      await onActionPress[ActionButton.Delete](row as T);
      return;
    }
    await handleDelete(row.id as string | number);
  };

  // Append an Actions column only when there are row-level actions
  const columnsTable = useMemo<ColumnTable<T>[]>(() => {
    const hasRowActions = actionColumns.some((a) =>
      ROW_ACTION_BUTTONS.includes(a),
    );
    return [
      ...columns,
      ...(hasRowActions
        ? ([{ key: "actions", title: "Actions", align: "end" }] as ColumnTable<T>[])
        : []),
    ];
  }, [columns, actionColumns]);

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar<T>
        label={label}
        isCardMode={false}
        withSearch={withSearch}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        actionColumns={actionColumns}
        customActionButtons={customActionButtons}
        customFilters={customFilters}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        onActionPress={onActionPress}
        computedRows={rows}
        handleCreate={handleCreate}
        handleExport={handleExport}
        handleImport={handleImport}
      />

      {/* Loading / Error rendered outside the table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner size="sm" />
        </div>
      ) : isError ? (
        <div className="py-6 text-center text-danger">Failed to load data.</div>
      ) : (
        <>
          {/* Table */}
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label={label ?? `${resource} table`}
                className="min-w-150"
              >
                <Table.Header>
                  {columnsTable.map((column, idx) => (
                    <Table.Column
                      key={column.key}
                      className={cn(
                        column.align === "center" && "text-center",
                        column.align === "end" && "text-end",
                        column.key === "actions" && "pr-12",
                        idx === 0 && "pl-8",
                      )}
                      isRowHeader={
                        column.isRowHeader ??
                        (columnsTable[0]?.key === "actions"
                          ? idx === 1
                          : idx === 0)
                      }
                    >
                      {column.title}
                    </Table.Column>
                  ))}
                </Table.Header>

                <Table.Body
                  items={rows}
                  renderEmptyState={() => (
                    <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                      {/*<Icon className="size-6 text-muted" icon="gravity-ui:tray" />*/}
                      <InboxIcon className="size-6 text-muted" />
                      <span className="text-sm text-muted">
                        No results found
                      </span>
                    </EmptyState>
                  )}
                >
                  {(row) => (
                    <Table.Row key={String(row.id)}>
                      {columnsTable.map((column, idx) => (
                        <Table.Cell
                          key={`${String(row.id)}-${column.key}`}
                          className={cn(
                            column.align === "center" && "text-center",
                            column.align === "end" && "text-end",
                            column.key === "actions" && "pr-12",
                            idx === 0 && "pl-8",
                          )}
                        >
                          {column.key === "actions" ? (
                            <div className="flex items-center justify-end gap-1">
                              {actionColumns.includes(ActionButton.Edit) && (
                                <Button
                                  variant="outline"
                                  isIconOnly
                                  size="sm"
                                  aria-label="Edit"
                                  onPress={() =>
                                    handleEdit(row.id as string | number)
                                  }
                                >
                                  <PencilIcon className="h-3 w-3" />
                                </Button>
                              )}
                              {actionColumns.includes(ActionButton.Show) && (
                                <Button
                                  variant="ghost"
                                  isIconOnly
                                  size="sm"
                                  aria-label="View"
                                  onPress={() =>
                                    handleShow(row.id as string | number)
                                  }
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </Button>
                              )}
                              {actionColumns.includes(ActionButton.Delete) && (
                                <AlertDialog
                                  triggerLabel="Delete"
                                  triggerContent={
                                    <TrashIcon className="h-4 w-4" />
                                  }
                                  triggerIsIconOnly
                                  triggerAriaLabel="Delete"
                                  title="Delete confirmation"
                                  description="Are you sure you want to delete this data?"
                                  confirmLabel="Delete"
                                  cancelLabel="Cancel"
                                  confirmVariant="danger"
                                  onConfirm={() =>
                                    handleConfirmDelete(row as T)
                                  }
                                />
                              )}
                            </div>
                          ) : column.render ? (
                            column.render(row as T)
                          ) : column.valueGetter ? (
                            column.valueGetter(row as T)
                          ) : (
                            String(row[column.key] ?? "-")
                          )}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-2">
              <Pagination>
                <Pagination.Summary>
                  Showing {Math.min((page - 1) * ps + 1, total)}–
                  {Math.min(page * ps, total)} of {total} results
                </Pagination.Summary>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={page === 1}
                      onPress={() => setPage(Math.max(1, page - 1))}
                    >
                      <Pagination.PreviousIcon />
                      <span>Previous</span>
                    </Pagination.Previous>
                  </Pagination.Item>

                  {buildPageItems(page, totalPages).map((item, idx) =>
                    item === null ? (
                      <Pagination.Item key={`ellipsis-${idx}`}>
                        <Pagination.Ellipsis />
                      </Pagination.Item>
                    ) : (
                      <Pagination.Item key={item}>
                        <Pagination.Link
                          isActive={item === page}
                          onPress={() => setPage(item)}
                        >
                          {String(item)}
                        </Pagination.Link>
                      </Pagination.Item>
                    ),
                  )}

                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={page === totalPages}
                      onPress={() => setPage(Math.min(totalPages, page + 1))}
                    >
                      <span>Next</span>
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
