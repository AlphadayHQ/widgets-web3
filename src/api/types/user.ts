import { TCryptoAccount } from "./primitives";

export enum WalletConnectionState {
    Disconnected,
    Connecting,
    Connected,
    ConnectionError,
    Verifying,
    Verified,
    Prompted,
    VerificationError,
    SigningOut,
    GenericError,
}

export type TPortfolioAccount = TCryptoAccount;

export type TAuthToken = {
    value: string;
    expirationDate?: string | undefined;
};

export type TAuthWallet = {
    account: TCryptoAccount | undefined;
    status: WalletConnectionState;
    error: string | null;
};

export type TUserAuth = {
    token: TAuthToken | undefined;
    wallet: TAuthWallet;
};

export type TUserSettings = Record<string, unknown>;

// TODO
export type TUserProfile = {
    // username: string | null;
    // firstName: string | null;
    // lastName: string | null;
    // email: string | null;
    avatar: string | null;
};
