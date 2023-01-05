import { alphadayApi } from "../alphadayApi";
import {
    TGetCoinsRequest,
    TGetCoinsResponse,
    TGetCoinsRawResponse,
} from "./types";
import CONFIG from "../../../config";

const { COINS } = CONFIG.API.DEFAULT.ROUTES;

const coinsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getCoins: builder.query<TGetCoinsResponse, TGetCoinsRequest>({
            query: () => `${COINS.BASE}${COINS.LIST}`,
            transformResponse: (r: TGetCoinsRawResponse): TGetCoinsResponse =>
                r.map((c) => {
                    return {
                        name: c.name,
                        ticker: c.ticker,
                        slug: c.slug,
                        icon: c.icon,
                    };
                }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetCoinsQuery } = coinsApi;
