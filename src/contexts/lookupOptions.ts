import { createElement, createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { SelectItemType } from '@/interfaces/common';

export interface LookupOptionsContextType {
  setLookupOptions: (key: string, options: SelectItemType[]) => void;
  getLookupOptions: (key: string) => SelectItemType[] | undefined;
}

export const LookupOptionsContext = createContext<LookupOptionsContextType>({
  setLookupOptions: () => {},
  getLookupOptions: () => undefined,
});

export const useLookupOptions = () => useContext(LookupOptionsContext);

export function LookupOptionsProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Record<string, SelectItemType[]>>({});

  const setLookupOptions = useCallback((key: string, options: SelectItemType[]) => {
    setStore((prev) => ({ ...prev, [key]: options }));
  }, []);

  const getLookupOptions = useCallback(
    (key: string) => store[key],
    [store],
  );

  return createElement(LookupOptionsContext.Provider, { value: { setLookupOptions, getLookupOptions } }, children);
}
