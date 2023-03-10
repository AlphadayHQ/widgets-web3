/**
 * Guidelines to define API routes
 * - Endpoints' route objects should in general include a base route that
 * doesn't start nor end in `/`.
 * - OTOH, specific endpoints should start and finish with `/`
 * - When we only need to use `BASE/` we may just use a `DEFAULT = "/"`, eg.
 * `${String(MARKET.BASE)}${String(MARKET.DEFAULT)}?${params}`
 */

const API_V0 = {
    IS_PROD: true,
    DEFAULT_PARAMS: {
        RESPONSE_LIMIT: 20,
    },
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    ROUTES: {
        NEWS: {
            BASE: "items/news",
            TRENDING: "/trending/",
            LIST: "/",
            BOOKMARKS: "/bookmarks/",
            CLICKED: (id: number): string => `/${id}/clicked/`,
            BOOKMARK: (id: number): string => `/${id}/toggle_bookmark/`,
        },
        BLOG: {
            BASE: "items/blogs",
            TRENDING: "/trending/",
            LIST: "/",
            BOOKMARKS: "/bookmarks/",
            CLICKED: (id: number): string => `/${id}/clicked/`,
            BOOKMARK: (id: number): string => `/${id}/toggle_bookmark/`,
        },
        COINS: {
            BASE: "coins",
            LIST: "/",
        },
        DAO: {
            BASE: "items/dao",
            LIST: "/",
        },
        KEYWORDS: {
            BASE: "keywords",
            LIST: "/",
            FREQUENCY: "/frequency/",
            BY_ID: (id: number): string => `/${id}/`,
        },
        KEY_VALUE: {
            BASE: "key_value_store",
            STORE: {
                ETHEREUM_LAST_BLOCK: "ETHEREUM_LAST_BLOCK",
            },
        },
        TAGS: {
            BASE: "tags",
            LIST: "/",
            BY_ID: (id: number): string => `/${id}/`,
        },
        EVENT: {
            BASE: "items/events",
            LIST: "/",
        },
        USER: {
            BASE: "user",
            LOGIN: "/auth/login/",
            LOGOUT: "/logout/",
            ACCOUNTS: "/accounts/",
            MULTI_ACCOUNTS: "/accounts/bulk_create/",
            ACCOUNT_BY_ID: (id: string): string => `accounts/${id}/`,
            CONNECT_WALLET: "/connect/",
            SEND_ADDRESS: "user/accounts/",
            GENERATE_MESSAGE: "/message/generate/",
            VERIFY_SIGNATURE: "/signature/verify/",
            PROFILE: "/profile/",
        },
        PROJECTS: {
            BASE: "projects",
            LIST: "/",
            BY_ID: (id: number): string => `/${id}/`,
            TRENDING_NFTS: "/nft/trending/",
        },
        MARKET: {
            BASE: "market",
            DEFAULT: "/",
            HISTORY: "/history/",
        },
        STATUS: {
            BASE: "status",
            DEFAULT: "/",
        },
        SOCIALS: {
            BASE: "items/socials",
            TWITTER: "twitter",
            TWITTER_V1: "/tweets/",
        },
        TVL: {
            BASE: "tvl",
            DEFAULT: "/",
            HISTORY: "/history/",
        },
        VIEWS: {
            BASE: "ui",
            AVAILABLE_VIEWS: "/views/",
            VIEW_BY_ID: (id: number): string => `/views/${id}/`,
            RESOLVE: "/views/resolve/",
            WIDGETS: "/widgets/",
            VIEW_WIDGETS_BY_ID: (id: number): string => `/views/${id}/widgets/`,
            WIDGET_BY_ID: (id: number): string => `/widgets/${id}/`,
            WIDGET_CATEGORIES: "/widget_categories/",
        },
        PORTFOLIO: {
            RESOLVE_ENS: (ens: string): string => `/resolve_ens/${ens}/`,
        },
        PODCAST: {
            BASE: "items/podcasts",
            TRENDING: "/trending/",
            LIST: "/",
            BOOKMARKS: "/bookmarks/",
            DETAILS: (id: number): string => `/${id}/`,
            CLICKED: (id: number): string => `/${id}/clicked/`,
            BOOKMARK: (id: number): string => `/${id}/toggle_bookmark/`,
        },
        VIDEO: {
            BASE: "items/videos",
            TRENDING: "/trending/",
            LIST: "/",
            BOOKMARKS: "/bookmarks/",
            DETAILS: (id: number): string => `/${id}/`,
            CLICKED: (id: number): string => `/${id}/clicked/`,
            BOOKMARK: (id: number): string => `/${id}/toggle_bookmark/`,
        },
        SOURCES: {
            BASE: "/sources/",
            PODCAST: "?harvestor=podcast",
            VIDEO: "?harvestor=video",
        },
    },
};

// we might have different API versions running on prod concurrently in the future
export default {
    V0: API_V0,
    // V1: ...,
    DEFAULT: API_V0,
};
