import { createOptionsHook } from "@/hooks/createOptionsHook";
import { RESOURCE_LOOKUP_OPTIONS_KEY } from "@/constants/lookup-options-key";
import { IOptionsResponse } from "@/interfaces/options";

const criteriasOptionsBase = createOptionsHook<IOptionsResponse>({
  key: RESOURCE_LOOKUP_OPTIONS_KEY.CRITERIAS,
  resource: "lookups",
  id: "criterias",
});

export const useCriteriasOptions = () => criteriasOptionsBase();
