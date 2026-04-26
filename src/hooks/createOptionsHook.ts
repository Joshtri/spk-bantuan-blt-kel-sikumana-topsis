import { useOne } from "@refinedev/core";
import { useCallback, useEffect, useMemo } from "react";
import { IOptionsResponse } from "@/interfaces/options";
import { SelectItemType } from "@/interfaces/common";

import { useLookupOptions } from "@/contexts/lookupOptions";

type OptionsItem<T> = T extends object
  ? IOptionsResponse & T
  : IOptionsResponse;

type OptionsKey<T> = keyof OptionsItem<T>;

interface createOptionsHookProps<T> {
  /**
   * A unique key used to store and retrieve options
   * from the lookup options state.
   */
  key: string;
  /**
   * Base API resource path (e.g. `"global"`).
   */
  resource: string;
  /**
   * Resource identifier appended to the URL.
   * It can be a string or number depending on the API:
   * Examples:
   *   - number: "global/12"
   *   - string: "global/states"
   */
  id: string | number;
  /**
   * Optional key used when the API response doesn't follow
   * the standard `enumText` structure.
   * If provided, this key is used as the option `value`.
   */
  keyValueName?: OptionsKey<T>;
  /**
   * Optional key used when the API response doesn't follow
   * the standard `enumText` structure.
   * If provided, this key is used as the option `label`.
   */
  keyLabelName?: OptionsKey<T>;
  /**
   * Optional key to access the data array from a nested response.
   * Use when response is { success, message, data: [...] }
   */
  dataKey?: string;
}

export function createOptionsHook<T>({
  key,
  resource,
  id,
  keyValueName,
  keyLabelName,
  dataKey,
}: createOptionsHookProps<T>) {
  return function useOptions(
    useForFilter: boolean = false,
    customFilter?: {
      keyName: OptionsKey<T>;
      filterValue:
      | OptionsItem<T>[OptionsKey<T>]
      | OptionsItem<T>[OptionsKey<T>][];
    },
  ) {
    const effectiveKey = useMemo(() => {
      if (!customFilter) return key;

      const { keyName, filterValue } = customFilter;

      const valuePart = Array.isArray(filterValue)
        ? [...filterValue].sort().join(",")
        : String(filterValue);

      return `${key}.${String(keyName)}.${valuePart}`;
    }, [customFilter]);

    const { getLookupOptions, setLookupOptions } = useLookupOptions();
    const options = getLookupOptions(effectiveKey);

    const {
      result: data,
      query: { isLoading },
    } = useOne<OptionsItem<T>[]>({
      resource,
      id,
      queryOptions: {
        enabled: !options,
        staleTime: 86400000, // 24 hours
        queryKey: [id, effectiveKey],
        refetchOnMount: false,
      },
    });

    // Memoize the mapping function to avoid recreating it on every render
    const mapOptions = useCallback(
      (items: OptionsItem<T>[]): SelectItemType[] => {
        return items.map<SelectItemType>((item) => {
          const itemAny = item as Record<string, unknown>;
          const value = (
            keyValueName
              ? itemAny[keyValueName as string]
              : (itemAny.id ?? itemAny.value ?? itemAny.enumText)
          ) as string;
          const label = (
            keyLabelName
              ? itemAny[keyLabelName as string]
              : (itemAny.label ?? itemAny.text)
          ) as string;

          return {
            ...item,
            key: value,
            label,
            value,
            text: label,
          };
        });
      },
      [],
    );

    useEffect(() => {
      // Early return if data doesn't exist or options already loaded
      if (!data || options) return;

      // Access the data array - either directly or from nested structure
      const dataArray = dataKey
        ? (data as unknown as Record<string, unknown>)[dataKey]
        : data;

      if (!Array.isArray(dataArray)) return;

      const filtered = customFilter
        ? (dataArray as unknown as OptionsItem<T>[]).filter((item) => {
          const itemValue = item[customFilter.keyName];
          const { filterValue } = customFilter;

          if (Array.isArray(filterValue)) {
            const valueSet = new Set(filterValue);
            return valueSet.has(itemValue);
          }

          return itemValue === filterValue;
        })
        : (dataArray as unknown as OptionsItem<T>[]);

      const mappedOptions = mapOptions(filtered);
      setLookupOptions(effectiveKey, mappedOptions);
    }, [
      data,
      options,
      customFilter,
      effectiveKey,
      mapOptions,
      setLookupOptions,
      dataKey,
    ]);

    const finalOptions = useMemo(() => {
      const opts = options ?? [];

      if (!useForFilter) return opts;

      const hasAll = opts.some((opt) => opt.value === "all");

      if (hasAll) {
        // Move 'all' to the front if it exists
        return [...opts].sort((a, b) =>
          a.value === "all" ? -1 : b.value === "all" ? 1 : 0,
        );
      }

      // Add 'all' option at the beginning
      return [{ key: "all", label: "All", value: "all", text: "All" }, ...opts];
    }, [options, useForFilter]);

    return { options: finalOptions, isLoading, raw: data };
  };
}
