import { useEffect } from "react";
import {
    useSaveUserAccountMutation,
    useGenerateMessageMutation,
    useVerifySignatureMutation,
    useConnectWalletMutation,
    useGetUserAccountsQuery,
    useLogoutMutation,
    useGetViewsQuery,
    useDeleteUserAccountMutation,
    useGetUserProfileQuery,
} from "../../api/services";
import {
    WalletConnectionState,
    TPortfolioAccount,
    TAuthWallet,
} from "../../api/types";
import { useAppSelector, useAppDispatch } from "../../api/store/hooks";
import {
    mapAccountsToEnsOrAddressArray,
    validateAccount,
    accountExists,
    syncAccounts,
    removeDuplicateAccounts,
} from "../../api/utils/accountUtils";
import { MetamaskNotInstalledError } from "../../api/errors";
import * as userStore from "../../api/store/slices/user";
import { isString, ignoreConcurrentAsync } from "../../api/utils/helpers";
import { Logger } from "../../api/utils/logging";
import assert from "../../api/utils/assert";

import { EWalletEvent, useWalletEvent } from "./useWalletEvent";
import { EToastRole, toast } from "../utils/toastUtils";

const RPC_ERROR_CODES = {
    REJECTED_BY_USER: 4001,
};

const portfolioFeedbackMessages = {
    success: "Your portfolio has been updated successfully",
    error:
        "An error occurred and we could not save your portfolio. Please try again later",
};

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ethereum: any;
    }
}

interface IWallet {
    authWallet: TAuthWallet;
    portfolioAccounts: TPortfolioAccount[];
    addPortfolioAccount: (account: TPortfolioAccount) => void;
    removePortfolioAccount: (account: TPortfolioAccount) => void;
    selectedPortfolioAccount: TPortfolioAccount | null;
    setSelectedPortfolioAccount: (account: TPortfolioAccount) => void;
    connectWallet: () => Promise<void>;
    resetWalletConnection: () => void;
    verifyWallet: () => void;
    resetWalletVerification: () => void;
    signout: () => MaybeAsync<void>;
    isAuthenticated: boolean;
    isStaff: boolean;
    resetAuthState: () => void;
}

export const useWallet: () => IWallet = () => {
    const dispatch = useAppDispatch();

    const authWallet = useAppSelector(userStore.selectAuthWallet);

    const portfolioAccounts = useAppSelector(userStore.selectPortfolioAccounts);

    const selectedPortfolioAccount = useAppSelector(
        userStore.selectSelectedPortfolioAccount
    );

    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);

    const [connectWalletMut] = useConnectWalletMutation();

    const [generateMessageMut] = useGenerateMessageMutation();

    const [verifySignatureMut] = useVerifySignatureMutation();

    const [logoutMut] = useLogoutMutation();

    const [saveAccountMut] = useSaveUserAccountMutation();
    const [deleteAccountMut] = useDeleteUserAccountMutation();

    const {
        currentData: remoteAccounts,
        refetch: refetchAccounts,
    } = useGetUserAccountsQuery(undefined, {
        skip: !isAuthenticated,
        refetchOnMountOrArgChange: true,
    });

    const { currentData: remoteProfile } = useGetUserProfileQuery(undefined, {
        skip: !isAuthenticated,
        refetchOnMountOrArgChange: true,
    });

    const isStaff = remoteProfile?.user.is_staff ?? false;

    const { refetch: refetchViews } = useGetViewsQuery();

    const { addListener, removeListener, isRegistered } = useWalletEvent(
        EWalletEvent.AccountChanged
    );

    const setPortfolioAccounts = (accounts: TPortfolioAccount[]) => {
        dispatch(userStore.setPortfolioAccounts(accounts));
    };

    const setSelectedPortfolioAccount = (account: TPortfolioAccount | null) => {
        dispatch(userStore.setSelectedPortfolioAccount(account));
    };

    const resetWalletConnection = () => {
        dispatch(userStore.setWalletDisconnected());
    };

    // remove auth token but keep portfolio accounts
    const cleanAuthState = () => {
        setSelectedPortfolioAccount(null);
        dispatch(userStore.setAuthToken(undefined));
    };

    const resetAuthState = () => {
        dispatch(userStore.resetAuthState());
    };

    const addPortfolioAccount = (account: TPortfolioAccount) => {
        Logger.debug("useWallet:addPortfolioAccount called");

        if (!validateAccount(account)) {
            toast("You have entered an Invalid address, please try again.", {
                type: EToastRole.Error,
            });
            return;
        }
        if (accountExists(portfolioAccounts, account)) {
            // do not error on purpuse since there is some re-entrancy due to
            // lag in state updates that trigger this function
            return;
        }

        const normalisedAccount = {
            address: account.address?.toLowerCase() ?? null,
            ens: account.ens?.toLowerCase() ?? null,
        };

        if (isAuthenticated) {
            const body = {
                addresses: mapAccountsToEnsOrAddressArray([
                    ...portfolioAccounts,
                    normalisedAccount,
                ]),
            };
            Logger.debug("useWallet:addPortfolioAccount::body:", body);
            saveAccountMut(body)
                .unwrap()
                .then((saveAccResponse) => {
                    Logger.debug(
                        "useWallet:addPortfolioAccount: fulfilled. Response:",
                        saveAccResponse
                    );
                    toast(portfolioFeedbackMessages.success);
                    refetchAccounts();
                })
                .catch((saveAccErr) => {
                    Logger.error(
                        "useWallet:addPortfolioAccount: error. Error Response:",
                        saveAccErr
                    );
                    toast(portfolioFeedbackMessages.error, {
                        type: EToastRole.Error,
                    });
                });
        }
        dispatch(userStore.addPortfolioAccount(normalisedAccount));
        dispatch(userStore.setSelectedPortfolioAccount(normalisedAccount));
    };

    const removeAccountLocally = (account: TPortfolioAccount) => {
        const filteredAccounts = portfolioAccounts.filter(
            (acc) => acc.address !== account.address
        );
        setPortfolioAccounts(filteredAccounts);
        // if the removed account was previously selected, just select
        // the first available account if any
        if (
            account.address === selectedPortfolioAccount?.address ||
            filteredAccounts.length === 0
        ) {
            const newSelectedAccount = filteredAccounts[0] ?? null;
            setSelectedPortfolioAccount(newSelectedAccount);
        }
        toast(portfolioFeedbackMessages.success);
    };

    const removePortfolioAccount = (account: TPortfolioAccount) => {
        Logger.debug("useWallet: removePortfolioAccount called");
        if (account.address == null && account.ens == null) {
            Logger.error(
                "useWallet:removePortfolioAccount: both hex and ens addresses are null, exiting..."
            );
            return;
        }
        if (!accountExists(portfolioAccounts, account)) return;
        const { id } = portfolioAccounts.filter(
            (acc) =>
                acc.address === account.address ||
                (acc.ens && acc.ens === account.ens) // `undefined === undefined` is true so we need to check for undefined/null explicitly
        )[0];
        Logger.debug("useWallet: removing account id", id);
        if (id !== undefined && isAuthenticated) {
            deleteAccountMut({ id })
                .unwrap()
                .then((deleteAccResponse) => {
                    Logger.debug(
                        "useWallet:removePortfolioAccount: fulfilled. Response:",
                        deleteAccResponse
                    );
                    removeAccountLocally(account);
                    refetchAccounts();
                })
                .catch((deleteAccErr) => {
                    if (deleteAccErr.status === 404) {
                        // this may happen if accounts are not synced correctly
                        removeAccountLocally(account);
                        return;
                    }
                    Logger.error(
                        "useWallet:removePortfolioAccount: error. Error Response:",
                        deleteAccErr
                    );
                    toast(portfolioFeedbackMessages.error, {
                        type: EToastRole.Error,
                    });
                });
        } else removeAccountLocally(account);
    };

    const verifyWallet = () => {
        Logger.debug("useWallet::verifyWallet called");
        if (
            authWallet.account?.address == null ||
            !(
                authWallet.status === WalletConnectionState.Prompted ||
                authWallet.status === WalletConnectionState.Connected
            )
        ) {
            Logger.warn(
                "useWallet::verifyWallet: trying to verify a wallet when none is connected"
            );
            return;
        }

        dispatch(userStore.initWalletVerification());
        const address = authWallet.account?.address;
        generateMessageMut({ address })
            .unwrap()
            .then(async (genMsgResp) => {
                Logger.debug("useWallet:verifyWallet:genMsgResp", genMsgResp);
                const { message } = genMsgResp;
                const signatureRequest = `0x${Buffer.from(
                    message,
                    "utf8"
                ).toString("hex")}`;
                const signature = await window.ethereum.request({
                    method: "personal_sign",
                    params: [signatureRequest, address, "Example password"],
                });
                verifySignatureMut({
                    address,
                    signature,
                })
                    .unwrap()
                    .then((verifyResp) => {
                        const { token } = verifyResp;
                        if (token) {
                            Logger.debug(
                                "useWallet:verifyWallet: success",
                                verifyResp
                            );
                            dispatch(
                                userStore.setAuthToken({
                                    value: token,
                                })
                            );
                            dispatch(userStore.setWalletVerified());
                            return;
                        }
                        Logger.error(
                            "useWallet:verifyWallet: response does not include token",
                            verifyResp
                        );
                    })
                    .catch((rejected) => {
                        Logger.error(
                            "useWalletConnect:verifyWallet: error",
                            rejected
                        );
                        dispatch(
                            userStore.setWalletAuthError(
                                "Could not verify signature"
                            )
                        );
                        dispatch(userStore.setWalletInVerificationError());
                    });
            })
            .catch((rejected) => {
                Logger.error("useWallet:verifyWallet: error", rejected);
                if (rejected.code === RPC_ERROR_CODES.REJECTED_BY_USER) {
                    // if action is rejected, no need to move to error state
                    // move back to connected state instead
                    dispatch(userStore.setWalletConnected());
                    return;
                }
                dispatch(
                    userStore.setWalletAuthError(
                        "Could not generate signature request"
                    )
                );
                dispatch(userStore.setWalletInVerificationError());
            });
    };

    const resetWalletVerification = () => {
        dispatch(userStore.setWalletConnected());
    };

    const signout = async () => {
        await ignoreConcurrentAsync<void, void>(async () => {
            Logger.debug("useWallet::signout called");
            if (authWallet.status === WalletConnectionState.SigningOut) {
                /**
                 * On rare occasions, the user can click the signout button multiple times
                 * before the wallet is actually disconnected. This is a safeguard to prevent
                 * multiple signout requests/state changes.
                 */
                Logger.debug("useWallet::signout: already signing out");
                return;
            }
            try {
                dispatch(userStore.initSignOut());
                const response = await logoutMut();
                Logger.debug(
                    "useWallet::signout endpoint call success",
                    response
                );
                removeListener();
                refetchViews();
                // note: wallet state is reset in user store extra reducers
            } catch (error) {
                Logger.error("useWallet::signout failed", error);
                dispatch(userStore.setWalletInGenericError());
                dispatch(userStore.setWalletAuthError(JSON.stringify(error)));
            }
        }, 5000)();
    };

    /**
     * Take first account from Metamask and set it as the connected crypto account
     * If the account was not saved in the accounts array, save it.
     * Finally, set this address as the selected portfolio address.
     */
    const connectWallet = async () => {
        try {
            Logger.debug("useWallet::connectWallet called");
            dispatch(userStore.initWalletConnection());
            if (window.ethereum == null) throw new MetamaskNotInstalledError();
            const newAccounts: string[] = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const address = newAccounts[0].toLowerCase();
            assert(
                isString(address),
                "useWallet::connectWallet: account address must be a string"
            );
            connectWalletMut({ address })
                .unwrap()
                .then((connectionResponse) => {
                    Logger.debug(
                        "useWallet:connectWallet: success",
                        connectionResponse
                    );
                    dispatch(userStore.setWalletAccount(address));
                    dispatch(userStore.setWalletConnected());
                    addPortfolioAccount({
                        address,
                    });
                    dispatch(userStore.requestWalletVerification());
                    // when user connects a wallet, it becomes the selected
                    // address in the portfolio widget
                    dispatch(
                        userStore.setSelectedPortfolioAccount({ address })
                    );
                })
                .catch((rejected) => {
                    Logger.error("useWallet:connectWallet: error", rejected);
                    dispatch(
                        userStore.setWalletAuthError("Could not connect wallet")
                    );
                    dispatch(userStore.setWalletInConnectionError());
                });
        } catch (err) {
            if (err.code === RPC_ERROR_CODES.REJECTED_BY_USER) {
                // if action is rejected, no need to move to error state
                dispatch(userStore.setWalletDisconnected());
                return;
            }
            let errorMsg = "Unexpected error.";
            Logger.error("useWallet:connectWallet", err);
            if (err instanceof MetamaskNotInstalledError) {
                errorMsg = "Metamask not installed. Please install it first!";
            }
            dispatch(userStore.setWalletAuthError(errorMsg));
            dispatch(userStore.setWalletInConnectionError());
        }
    };

    if (
        !isRegistered &&
        (isAuthenticated ||
            authWallet.status === WalletConnectionState.Connected)
    ) {
        try {
            // register new account if it's not already in the list
            addListener(async ([account]) => {
                Logger.debug("useWallet: account change event handler called");
                // wallet has been disconnected so we signout the user
                if (!account) {
                    if (authWallet.status === WalletConnectionState.Verified) {
                        Logger.debug("useWallet: signing out...");
                        await signout();
                    } else {
                        Logger.debug("useWallet: wallet disconnected");
                        resetAuthState();
                    }
                } else if (account !== authWallet.account?.address) {
                    Logger.debug(
                        "useWallet: Account switch, wallet state:",
                        authWallet
                    );
                    if (authWallet.status === WalletConnectionState.Verified) {
                        Logger.debug("useWallet: signing out...", "verified");
                        await signout();
                    } else {
                        Logger.debug(
                            "useWallet: disconnecting current wallet..."
                        );
                        cleanAuthState();
                        resetWalletConnection();
                    }
                    Logger.debug(
                        "useWallet: attempting to reconnect to the new account..."
                    );
                    connectWallet()
                        .then(() =>
                            Logger.debug(
                                "useWallet::connectWallet: reconnected",
                                authWallet.status
                            )
                        )
                        .catch((e) =>
                            Logger.error("useWallet::connectWallet: error", e)
                        );
                }
            });
        } catch (e) {
            if (!(e instanceof MetamaskNotInstalledError)) {
                Logger.error("useWallet: unexpected error", e);
            }
            resetAuthState();
        }
    }

    useEffect(() => {
        /**
         * Remote accounts are never fetched if the user is not verified
         * and so no additional checks are needed here.
         */
        if (remoteAccounts && remoteAccounts.length > 0) {
            setPortfolioAccounts(
                syncAccounts(portfolioAccounts, remoteAccounts)
            );
        }
        /**
         * We would ignore adding `setPortfolioAccounts` as a dep for this effect.
         * It reference would change on it render and it's only required because it calls `dispatch` internally.
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remoteAccounts]);

    useEffect(() => {
        if (
            portfolioAccounts.length !==
            removeDuplicateAccounts(portfolioAccounts).length
        ) {
            Logger.error(
                "useWallet: portfolio contains duplicated accounts, it should never happen"
            );
        }
    }, [portfolioAccounts]);

    return {
        authWallet,
        addPortfolioAccount,
        selectedPortfolioAccount,
        setSelectedPortfolioAccount,
        removePortfolioAccount,
        portfolioAccounts,
        connectWallet,
        resetWalletConnection,
        verifyWallet,
        resetWalletVerification,
        signout,
        isAuthenticated,
        isStaff,
        resetAuthState,
    };
};
