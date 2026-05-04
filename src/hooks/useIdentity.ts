import { useGetIdentity } from "@refinedev/core";
import { IAuthIdentity } from "@/interfaces/Authorize";
import { useMemo } from "react";

export function useIdentity() {
  const { data: identity, isLoading } = useGetIdentity<IAuthIdentity>();
  return useMemo(() => ({ identity, isLoading }), [identity, isLoading]);
}
