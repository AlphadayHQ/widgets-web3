import { MetamaskNotInstalledError } from "../../api/errors";
import { Logger } from "../../api/utils/logging";
import { useCallback, useRef } from "react";

export enum EWalletEvent {
    Connect = "connect",
    Disconnect = "disconnect",
    AccountChanged = "accountsChanged",
    NetworkChanged = "chainChanged",
}

type TWalletEventCallback = (accounts: string[]) => MaybeAsync<void>;

interface IWalletEvent {
    isRegistered: boolean;
    addListener: (callback: TWalletEventCallback) => void;
    removeListener: () => void;
}

/**
 * Listen for wallet events
 *
 * (@elcharitas): At first, This hook was to be used to listen for events and handle all the complexities.
 * But then arose a issue. In `useWallet.ts` file, we are using `useWalletEvent` hook to listen for events.
 * And this implies we need to listen for events only after `useWallet::connectWallet` is called.
 * To solve this, I created two functions which this hook returns. This functions would be used  to listen for events.
 */
export const useWalletEvent = (event: EWalletEvent): IWalletEvent => {
    const eventRef = useRef<TWalletEventCallback>();

    const addListener = useCallback(
        (callback: TWalletEventCallback): void => {
            if (window.ethereum == null) throw new MetamaskNotInstalledError();
            if (eventRef.current && typeof window.ethereum.on === "function") {
                Logger.warn(
                    "useWalletEvent: subscription exists already, removing..."
                );
                window.ethereum.removeListener(event, eventRef.current);
            }
            Logger.debug("useWalletEvent: subscribing to event", event);
            eventRef.current = callback;
            window.ethereum.on(event, eventRef.current);
        },
        [event]
    );

    const removeListener = useCallback((): void => {
        try {
            if (window.ethereum == null) throw new MetamaskNotInstalledError();
            if (
                !(eventRef.current && typeof window.ethereum.on === "function")
            ) {
                Logger.warn(
                    "useWalletEvent::removeListener: no subscription found",
                    event
                );
                return;
            }
            Logger.debug(
                "useWalletEvent::removeListener: unsubscribing from event",
                event
            );
            window.ethereum.removeListener(event, eventRef.current);
        } catch (e) {
            Logger.error("useWalletEvent::removeListener: unexpected error", e);
        }
    }, [event]);

    return {
        addListener,
        removeListener,
        isRegistered: !!eventRef.current,
    };
};
