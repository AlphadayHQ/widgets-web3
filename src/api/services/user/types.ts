/**
 * Primitive types
 */

export type TRemoteUserRegister = {
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
    is_staff: boolean;
};

export type TRemoteLogin = {
    email: string;
    username: string;
    password: string;
};

export type TRemoteCustomRegister = TRemoteUserRegister;

export type TRemoteProfile = {
    id: number;
    user: TRemoteCustomRegister;
    location?: string;
    currency?: string;
    identicon?: string;
    twitter_username?: string;
    github_username?: string;
};

export type TRemoteAccount = {
    id: number;
    address: string;
    ens?: string | null;
};

/**
 * Query types
 */

export type TLoginRequest = TRemoteLogin;
export type TLoginResponse = TRemoteLogin;

export type TConnectUserRequest = {
    address: string;
    token?: string;
};
export type TConnectUserResponse = {
    id: string;
    address: string;
    message?: string | null;
    is_verified: boolean;
};

export type TGenerateMessageRequest = {
    address: string;
    // token?
};
export type TGenerateMessageResponse = {
    message: string;
};

export type TVerifySignatureRequest = {
    address: string;
    signature: string;
};
export type TVerifySignatureResponse = {
    token?: string;
};

export type TGetUserAccountsRequest = void;
export type TGetUserAccountsResponse = TRemoteAccount[];

export type TSaveUserAccountsRequest = {
    address?: string;
    addresses?: string[];
};
export type TSaveUserAccountsResponse = TSaveUserAccountsRequest;

export type TDeleteUserAccountsRequest = { id: number };
export type TDeleteUserAccountsResponse = TDeleteUserAccountsRequest;

export type TGetUserAccountByIdRequest = { id: string };
export type TGetUserAccountByIdResponse = TRemoteAccount;

export type TGetUserProfileRequest = void;
export type TGetUserProfileResponse = TRemoteProfile;
