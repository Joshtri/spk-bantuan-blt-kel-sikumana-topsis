import { useState } from "react";
import { useList } from "@refinedev/core";
import type { BaseRecord } from "@refinedev/core";

interface UseDataTableDataOptions {
  resource: string;
  pageSize?: number;
}

interface UseDataTableDataResult<T> {
  rows: T[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
}

export function useDataTableData<T extends BaseRecord>({
  resource,
  pageSize = 10,
}: UseDataTableDataOptions): UseDataTableDataResult<T> {
  const [page, setPage] = useState(1);

  const {
    result : data,
    query: { isLoading, isError },
  } = useList<T>({
    resource,
    pagination: {
      currentPage: page,
      pageSize,
    },
  });

  const rows = (data?.data ?? []) as T[];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    rows,
    total,
    totalPages,
    page,
    pageSize,
    setPage,
    isLoading,
    isError,
  };
}
