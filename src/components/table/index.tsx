import { useMemo, useState } from "react";
import type { BaseRecord } from "@refinedev/core";
import { Pagination, Spinner } from "@heroui/react";

import {
  ActionButton,
  type ActionButtonHandlerMap,
  type ColumnTable,
  type CustomActionButton,
  type CustomFilter,
  type CustomRowActionButton,
} from "./types";
import { useDataTableData } from "./hooks/useDataTableData";
import { useDataTableActions } from "./hooks/useDataTableActions";
import { TableToolbar } from "./TableToolbar";
import { CardView, TableView } from "./views";

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

interface DataTableProps<T extends BaseRecord> {
  resource: string;
  resourceDelete?: string; // Optional custom resource name for delete action
  columns: ColumnTable<T>[];
  actionColumns?: ActionButton[];
  label?: string;
  description?: string;
  pageSize?: number;
  withSearch?: boolean;
  customActionButtons?: CustomActionButton[];
  customRowActionButtons?: CustomRowActionButton<T>[];
  customFilters?: CustomFilter<T>[];
  onActionPress?: Partial<ActionButtonHandlerMap<T>>;
}

export default function DataTable<T extends BaseRecord>({
  resource,
  resourceDelete = undefined,
  columns,
  actionColumns = [],
  label,
  description,
  pageSize = 10,
  withSearch = false,
  customActionButtons = [],
  customRowActionButtons = [],
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
    useDataTableActions({ resource, resourceDelete });

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

  // No longer needed - TableView handles actions column

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar<T>
        label={label}
        description={description}
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
          {/* Card View for mobile/tablet */}
          <CardView
            rows={rows}
            columns={columns}
            actionColumns={actionColumns}
            customRowActionButtons={customRowActionButtons}
            onEdit={handleEdit}
            onShow={handleShow}
            onDelete={handleConfirmDelete}
          />

          {/* Table View for desktop */}
          <TableView
            rows={rows}
            columns={columns}
            actionColumns={actionColumns}
            customRowActionButtons={customRowActionButtons}
            onEdit={handleEdit}
            onShow={handleShow}
            onDelete={handleConfirmDelete}
          />

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
