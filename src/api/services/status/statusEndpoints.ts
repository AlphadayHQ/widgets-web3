import { Logger } from "../../../api/utils/logging";
import { alphadayApi } from "../alphadayApi";
import { TGetStatusRequest, TGetStatusResponse } from "./types";
import CONFIG from "../../../config";

const { STATUS } = CONFIG.API.DEFAULT.ROUTES;

const statusApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getRemoteStatus: builder.query<TGetStatusResponse, TGetStatusRequest>({
            query: () => {
                const route = `${String(STATUS.BASE)}${String(STATUS.DEFAULT)}`;
                Logger.debug("getRemoteStatus: querying", route);
                return route;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetRemoteStatusQuery } = statusApi;
