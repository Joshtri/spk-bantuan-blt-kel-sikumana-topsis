import { createOptionsHook } from "@/hooks/createOptionsHook";
import { RESOURCE_LOOKUP_OPTIONS_KEY } from "@/constants/lookup-options-key";
import { IOptionsResponse } from "@/interfaces/options";

const authorOptionsBase = createOptionsHook<IOptionsResponse>({
  key: RESOURCE_LOOKUP_OPTIONS_KEY.GLOBAL.AUTHOR,
  resource: "authors",
  id: "options",
});

export const useAuthorOptions = () => authorOptionsBase();
