import { createOptionsHook } from "@/hooks/createOptionsHook";
import { RESOURCE_LOOKUP_OPTIONS_KEY } from "@/constants/lookup-options-key";
import { IOptionsResponse } from "@/interfaces/options";

const candidatesOptionsBase = createOptionsHook<IOptionsResponse>({
    key: RESOURCE_LOOKUP_OPTIONS_KEY.CANDIDATES,
    resource: "lookups",
    id: "candidates",
});

export const useCandidatesOptions = () => candidatesOptionsBase();