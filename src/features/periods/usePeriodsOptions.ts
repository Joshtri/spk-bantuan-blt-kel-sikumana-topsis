import { createOptionsHook } from "@/hooks/createOptionsHook";
import { RESOURCE_LOOKUP_OPTIONS_KEY } from "@/constants/lookup-options-key";
import { IOptionsResponse } from "@/interfaces/options";

const periodsOptionsBase = createOptionsHook<IOptionsResponse>({
  key: RESOURCE_LOOKUP_OPTIONS_KEY.PERIODS,
  resource: "lookups",
  id: "periods",
});

export const usePeriodsOptions = () => periodsOptionsBase();
