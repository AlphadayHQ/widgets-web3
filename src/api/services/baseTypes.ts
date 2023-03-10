/**
 * Alphaday remote base types
 */

export enum ETag {
    Global = "global",
    Local = "local",
}

export type TBaseTag = {
    id: number;
    name: string;
    slug: string;
    tag_type: ETag;
};

export type TRemoteTagMeta = {
    tag_type: string; // drct | prnt
    is_source_tag: boolean;
    is_locked: boolean;
};

export type TRemoteTagKeyword = {
    id: number;
    name: string;
    is_excluded: boolean;
};

export type TRemoteTagBase = {
    name: string;
    slug: string;
    keywords: TRemoteTagKeyword[];
};

export type TRemoteTagWithMeta = TBaseTag & {
    meta?: TRemoteTagMeta; // note: BE doesn't seem to return this
};

export type TRemoteTag = TRemoteTagWithMeta & {
    keywords: TRemoteTagKeyword[];
    parents: TRemoteTagBase[];
};

export type TRemoteTagReadOnly = TBaseTag;

export type TRemoteItem = {
    id: number;
    hash: string;
    title: string;
    url: string;
    tags: TRemoteTagReadOnly[];
    source: {
        name: string;
        slug: string;
        icon: string;
    };
    num_clicks: number;
    is_bookmarked: boolean;
};

export type TPagination = {
    links: {
        next: string | null;
        previous: string | null;
    };
    total: number;
};

export type TProjectType = "protocol" | "chain";

export type TRemoteChain = {
    name: string;
    slug: string;
};

export type TRemoteLink = {
    label: string;
    url: string;
};

export type TRemoteBaseProject = {
    name: string;
    slug: string;
    project_type: TProjectType;
    network_id?: number;
    icon?: string;
};

export type TBaseCoin = {
    id: number;
    name: string;
    ticker: string;
    slug: string;
    icon?: string;
    description?: string;
    max_supply?: number;
    circulating_supply?: number;
    total_supply?: number;
    rank?: number;
    gecko_id?: number;
    cmc_id?: number;
};

export type TRemoteWriteComment = {
    content_type: string;
    object_pk: string;
    timestamp: string;
    security_hash: string;
    honeypot: string;
    name: string;
    email: string;
    url: string;
    comment: string;
    followup: boolean;
    reply_to: number;
};

export type TRemoteFlag = {
    comment: number;
    flag: string;
};

export type TTvlDatum = {
    currency: string;
    tvl: number;
    tvl_percent_change_1h: number;
    tvl_percent_change_1d: number;
    tvl_percent_change_7d: number;
    date: string;
};
