import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Logger } from "../../api/utils/logging";
import { TUserAuth } from "../../api/types";
import CONFIG from "../../config";

const { API_BASE_URL } = CONFIG.API.DEFAULT;

export const alphadayApi = createApi({
    reducerPath: "alphadayApi",
    tagTypes: ["Views"],
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers: Headers, { getState }): Headers => {
            headers.set("Version", CONFIG.APP.VERSION);
            // @ts-expect-error
            const authState = getState().user.auth as TUserAuth | null;
            if (authState != null && authState?.token !== undefined) {
                const token = authState.token.value;
                if (token != null) {
                    // eslint-disable-next-line
                    headers.set("Authorization", `Token ${token}`);
                } else {
                    Logger.debug(
                        "alphadayApi::prepareHeaders: no session token"
                    );
                }
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
});
