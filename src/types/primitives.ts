export enum ETag {
    Global = "global",
    Local = "local",
}

export type TKeyword = {
    id: number;
    name: string;
    tag: TTag;
};

export type TTag = {
    id: number;
    name: string;
    slug: string;
    tagType: ETag;
};

export type TBaseItem = {
    id: number;
    title: string;
    url: string;
    sourceIcon: string;
    sourceSlug: string;
    sourceName: string;
    bookmarked: boolean;
};

export type TDynamicItem<T> = {
    [key: string]: T;
};

export enum EItemFeedPreference {
    Last = "last",
    Trending = "trending",
    Bookmark = "bookmark",
}

export type TCoin = {
    id: number;
    name: string;
    ticker: string;
    slug: string;
    icon?: string;
    // ...
    // backend provides more types
};

export type TBaseProject = {
    name: string;
    slug: string;
    projectType?: string;
    networkId: number;
    icon?: string;
};

export type TTvlDatum = {
    currency: string;
    tvl: number;
    percentChange1h: number;
    percentChange1d: number;
    percentChange7d: number;
    date: string;
};

export type TAssetValue = {
    value: number;
    denomination: string;
};

/**
 * the rationale for having the address as possibly null
 * was that in the future, we may define accounts using
 * a key instead (for non-account-based chains)
 */
export type TCryptoAccount = {
    // maybe we'll add these in the future
    id?: number;
    // chainId: number | undefined;
    // networkId: number | undefined;
    address: string | null;
    ens?: string | null;
};

export enum ECookieChoice {
    RejectAll,
    AccpetEssential,
    AcceptAll,
}
