/**
 * This initialization script replaces the remote API calls included
 * previously in globalContext.
 * It may be used to trigger API calls that are reused by different components
 * or that require periodic polling
 */
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../api/store/hooks";
import { useWallet } from "../../api/hooks";
import * as userStore from "../../api/store/slices/user";
import { WalletConnectionState } from "../../api/types";
import {
    useGetAssetsPriceQuery,
    useConnectWalletMutation,
} from "../../api/services";
import { Logger } from "../../api/utils/logging";

export const useAppInit: () => void = () => {
    const dispatch = useAppDispatch();

    const authToken = useAppSelector(userStore.selectAuthToken);

    const { authWallet, signout } = useWallet();

    const [connectWalletMut] = useConnectWalletMutation();

    // cache ethereum price in the "background"
    useGetAssetsPriceQuery(
        {
            ids: "ethereum",
            vs_currencies: "usd,eur",
        },
        {
            pollingInterval: 30 * 60 * 1000, // update every 30 min
        }
    );

    useEffect(() => {
        const checkUserAuth = async () => {
            // check whether this account is already connected
            // if it's connected, and a token exists, automatically attempt to verify
            // and open a session with the backend
            if (
                authWallet.account?.address &&
                authWallet.status === WalletConnectionState.Connected
            ) {
                if (authToken !== undefined) {
                    Logger.debug("appInit: attempting optimistic login");
                    // attempt optimistic authentication
                    connectWalletMut({
                        address: authWallet.account.address,
                        token: authToken.value,
                    })
                        .unwrap()
                        .then((connectionResponse) => {
                            Logger.debug(
                                "appInit::connectWalletMut::response:",
                                connectionResponse
                            );
                            if (!connectionResponse.is_verified) {
                                // logout user
                                dispatch(userStore.reset());
                                return;
                            }
                            dispatch(userStore.setWalletVerified());
                        })
                        .catch((rejected) => {
                            Logger.error(
                                "appInit:connectWalletMut: error trying to auto-verify account",
                                rejected
                            );
                            // we were not able to establish
                            // a session with the server.
                            // reset user state
                            dispatch(userStore.resetAuthState());
                        });
                    return;
                }

                // avoid unnecessary state changes
                Logger.debug("appInit: wallet already connected");
            } else if (authWallet.status === WalletConnectionState.Verified) {
                if (window.ethereum == null) {
                    Logger.info("appInit: web3 provides is null, signing out");
                    await signout();
                    return;
                }
                window.ethereum
                    .request({
                        method: "eth_requestAccounts",
                    })
                    .then(async ([curAccount]: string[]) => {
                        if (
                            !curAccount ||
                            curAccount.toLowerCase() !==
                                authWallet.account?.address?.toLowerCase()
                        ) {
                            await signout();
                        }
                    })
                    .catch(async () => {
                        await signout();
                    });
            }
        };
        checkUserAuth().catch((e) =>
            Logger.error("appInit::checkUserAuth: unexpected error", e)
        );
        /**
         * This effect should only run once, when the component is mounted.
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
