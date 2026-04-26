import type {
  DataProvider,
  BaseRecord,
  CrudSort,
  CrudFilter,
  Pagination,
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteOneParams,
  GetManyParams,
  CreateManyParams,
  UpdateManyParams,
  DeleteManyParams,
  CustomParams,
} from "@refinedev/core";
import { axiosInstance } from "./axios";
import type {
  ApiListResponse,
  ApiResponse,
  ApiMessageResponse,
} from "../interfaces/IBaseEntity";

// ---------------------------------------------------------------------------
// Pagination helper
// ---------------------------------------------------------------------------

function resolvePagination(pagination: Pagination | undefined): {
  page: number;
  pageSize: number;
} {
  const { currentPage = 1, pageSize = 10 } = pagination ?? {};
  return { page: currentPage, pageSize };
}

// ---------------------------------------------------------------------------
// Sorters / filters helpers
// ---------------------------------------------------------------------------

function buildSortParam(sorters: CrudSort[] | undefined): string | undefined {
  if (!sorters || sorters.length === 0) return undefined;
  return sorters.map((s) => `${s.field}:${s.order}`).join(",");
}

function buildFiltersParam(
  filters: CrudFilter[] | undefined,
): string | undefined {
  if (!filters || filters.length === 0) return undefined;
  return JSON.stringify(filters);
}

// ---------------------------------------------------------------------------
// DataProvider implementation
//
// We export with `as unknown as DataProvider` to satisfy the generic variance
// constraint: the interface declares every method as
//   <TData extends BaseRecord = BaseRecord>(...) => Promise<XxxResponse<TData>>
// Our concrete implementations always return BaseRecord — correct at runtime,
// but TypeScript can't prove BaseRecord is assignable to an arbitrary TData.
// Explicit param-type annotations are required because the cast removes
// inference from the object literal.
// ---------------------------------------------------------------------------

export const dataProvider = {
  getList: async ({
    resource,
    pagination,
    sorters,
    filters,
  }: GetListParams) => {
    const { page, pageSize } = resolvePagination(pagination);

    const params: Record<string, string> = {
      page: String(page),
      limit: String(pageSize),
    };

    const sort = buildSortParam(sorters);
    if (sort) params.sort = sort;

    const filtersParam = buildFiltersParam(filters);
    if (filtersParam) params.filters = filtersParam;

    const { data: envelope } = await axiosInstance.get<
      ApiListResponse<BaseRecord>
    >(`/${resource}`, { params });

    return {
      data: envelope.data ?? [],
      total: envelope.total ?? 0,
    };
  },

  getOne: async ({ resource, id }: GetOneParams) => {
    const { data: res } = await axiosInstance.get<ApiResponse<BaseRecord>>(
      `/${resource}/${id}`,
    );
    return { data: res.data };
  },

  create: async ({ resource, variables }: CreateParams) => {
    const { data: res } = await axiosInstance.post<ApiResponse<BaseRecord>>(
      `/${resource}`,
      variables,
    );
    return { data: res.data };
  },

  update: async ({ resource, id, variables }: UpdateParams) => {
    const { data: res } = await axiosInstance.patch<ApiResponse<BaseRecord>>(
      `/${resource}/${id}`,
      variables,
    );
    return { data: res.data };
  },

  deleteOne: async ({ resource, id }: DeleteOneParams) => {
    await axiosInstance.delete<ApiMessageResponse>(`/${resource}/${id}`);
    return { data: {} as BaseRecord };
  },

  getApiUrl: () => axiosInstance.defaults.baseURL ?? "",

  // ---------------------------------------------------------------------------
  // Optional methods
  // ---------------------------------------------------------------------------

  getMany: async ({ resource, ids }: GetManyParams) => {
    const { data: res } = await axiosInstance.get<ApiListResponse<BaseRecord>>(
      `/${resource}`,
      { params: { ids: ids.join(",") } },
    );
    return { data: res.data ?? [] };
  },

  createMany: async ({ resource, variables }: CreateManyParams) => {
    const { data: res } = await axiosInstance.post<ApiResponse<BaseRecord[]>>(
      `/${resource}/bulk`,
      variables,
    );
    return { data: res.data };
  },

  updateMany: async ({ resource, ids, variables }: UpdateManyParams) => {
    const { data: res } = await axiosInstance.patch<ApiResponse<BaseRecord[]>>(
      `/${resource}/bulk`,
      { ids, ...variables },
    );
    return { data: res.data };
  },

  deleteMany: async ({ resource, ids }: DeleteManyParams) => {
    await axiosInstance.delete<ApiMessageResponse>(`/${resource}/bulk`, {
      data: { ids },
    });
    return { data: [] };
  },

  custom: async ({ url, method, payload, query, headers }: CustomParams) => {
    const config = {
      params: query as Record<string, string> | undefined,
      headers: headers as Record<string, string> | undefined,
    };

    switch (method) {
      case "get":
        return { data: (await axiosInstance.get(url, config)).data };
      case "post":
        return { data: (await axiosInstance.post(url, payload, config)).data };
      case "put":
        return { data: (await axiosInstance.put(url, payload, config)).data };
      case "patch":
        return {
          data: (await axiosInstance.patch(url, payload, config)).data,
        };
      case "delete":
        return { data: (await axiosInstance.delete(url, config)).data };
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  },
} as unknown as DataProvider;
