import { alphadayApi } from "../alphadayApi";
import CONFIG from "../../../config";
import { TResolveEnsRequest, TResolveEnsResponse } from "./types";

const { PORTFOLIO } = CONFIG.API.DEFAULT.ROUTES;

const portfolioApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        resolveEns: builder.query<TResolveEnsResponse, TResolveEnsRequest>({
            query: ({ ens }) => PORTFOLIO.RESOLVE_ENS(ens),
        }),
    }),
});

export const { useResolveEnsQuery } = portfolioApi;
