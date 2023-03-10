import { Logger } from "../../../api/utils/logging";
import { alphadayApi } from "../alphadayApi";
import {
    TRemoteLogin,
    TConnectUserRequest,
    TConnectUserResponse,
    TGenerateMessageRequest,
    TGenerateMessageResponse,
    TVerifySignatureRequest,
    TVerifySignatureResponse,
    TGetUserAccountsRequest,
    TGetUserAccountsResponse,
    TSaveUserAccountsRequest,
    TSaveUserAccountsResponse,
    TGetUserAccountByIdRequest,
    TGetUserAccountByIdResponse,
    TDeleteUserAccountsRequest,
    TDeleteUserAccountsResponse,
    TGetUserProfileRequest,
    TGetUserProfileResponse,
} from "./types";
import CONFIG from "../../../config";

const { USER } = CONFIG.API.DEFAULT.ROUTES;

const userApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserAccounts: builder.query<
            TGetUserAccountsResponse,
            TGetUserAccountsRequest
        >({
            query: () => {
                const path = `${USER.BASE}${USER.ACCOUNTS}`;
                Logger.debug("getUserAccounts: querying", path);
                return path;
            },
        }),
        saveUserAccount: builder.mutation<
            TSaveUserAccountsRequest,
            TSaveUserAccountsResponse
        >({
            query: (request) => {
                const path = `${USER.BASE}${USER.MULTI_ACCOUNTS}`;
                Logger.debug("saveUserAccount: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: request,
                };
            },
        }),
        deleteUserAccount: builder.mutation<
            TDeleteUserAccountsRequest,
            TDeleteUserAccountsResponse
        >({
            query: (request) => {
                const ACCOUNT_ID = String(request.id);
                return {
                    url: `${USER.BASE}${USER.ACCOUNTS}${ACCOUNT_ID}`,
                    method: "DELETE",
                };
            },
        }),
        getUserAccountById: builder.query<
            TGetUserAccountByIdResponse,
            TGetUserAccountByIdRequest
        >({
            query: ({ id }) => `${USER.BASE}${USER.ACCOUNT_BY_ID(id)}`,
        }),
        login: builder.mutation<TRemoteLogin, TRemoteLogin>({
            query: (request) => ({
                url: `${USER.BASE}${USER.LOGIN}`,
                method: "POST",
                body: request,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: `${USER.BASE}${USER.LOGOUT}`,
                method: "POST",
                body: undefined,
            }),
            invalidatesTags: ["Views"],
        }),
        connectWallet: builder.mutation<
            TConnectUserResponse,
            TConnectUserRequest
        >({
            query: (request) => ({
                url: `${USER.BASE}${USER.CONNECT_WALLET}`,
                method: "POST",
                body: request,
            }),
        }),
        generateMessage: builder.mutation<
            TGenerateMessageResponse,
            TGenerateMessageRequest
        >({
            query: (request) => ({
                url: `${USER.BASE}${USER.GENERATE_MESSAGE}`,
                method: "POST",
                body: request,
            }),
        }),
        verifySignature: builder.mutation<
            TVerifySignatureResponse,
            TVerifySignatureRequest
        >({
            query: (request) => ({
                url: `${USER.BASE}${USER.VERIFY_SIGNATURE}`,
                method: "POST",
                body: request,
            }),
        }),
        getUserProfile: builder.query<
            TGetUserProfileResponse,
            TGetUserProfileRequest
        >({
            query: () => `${USER.BASE}${USER.PROFILE}`,
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetUserAccountsQuery,
    useSaveUserAccountMutation,
    useDeleteUserAccountMutation,
    useGetUserAccountByIdQuery,
    useLoginMutation,
    useLogoutMutation,
    useConnectWalletMutation,
    useGenerateMessageMutation,
    useVerifySignatureMutation,
    useGetUserProfileQuery,
} = userApi;
export const { logout } = userApi.endpoints;
