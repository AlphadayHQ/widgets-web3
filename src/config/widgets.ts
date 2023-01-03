// import { EItemFeedPreference } from "src/api/types"; // TODO type definition

const WIDGETS_CONFIG = {
    COMMON: {
        HEADER_HEIGHT: 42,
    },
    CALENDAR: {
        TAG_ITEM_TYPE: "event",
        QUERY_EVENTS_HARD_LIMIT: 200,
        WIDGET_HEIGHT: 604, // gotten from cal-month
        POLLING_INTERVAL: 180 * 60, // 3h
    },
    CHAT: {
        WIDGET_HEIGHT: 600,
    },
    DAO: {
        TAG_ITEM_TYPE: "dao",
        MAX_PAGE_NUMBER: 10,
        WIDGET_HEIGHT: 538,
        POLLING_INTERVAL: 15 * 60, // 15 min
    },
    FAQ: {
        WIDGET_HEIGHT: 550,
    },
    MAPS: {
        API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    },
    MARKET: {
        TAG_ITEM_TYPE: "coin",
        DEFAULT_INTERVAL: "1D",
        DEFAULT_MARKET: {
            name: "Ethereum",
            slug: "ethereum",
            ticker: "eth",
            icon:
                "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
        },
        QUERY_HARD_LIMIT: 30,
        COIN_POLLING_INTERVAL: 60, // 1 min
        HISTORY_POLLING_INTERVAL: 5 * 60, // 5 min
    },
    MEDIA: {
        YOUTUBE_EMBED_BASE_URL: "//www.youtube.com/embed/",
    },
    NETWORK: {
        POLLING_INTERVAL: 30, // 30 sec
    },
    NEWS: {
        TAG_ITEM_TYPE: "news",
        MAX_PAGE_NUMBER: 10,
        POLLING_INTERVAL: 8 * 60, // 8 min
        WIDGET_HEIGHT: 538,
        // DEFAULT_FEED_PREFERENCE: EItemFeedPreference.Last,
    },
    BLOG: {
        TAG_ITEM_TYPE: "blog",
        MAX_PAGE_NUMBER: 10,
        POLLING_INTERVAL: 8 * 60, // 8 min
        WIDGET_HEIGHT: 538,
        // DEFAULT_FEED_PREFERENCE: EItemFeedPreference.Last,
    },
    PODCAST: {
        WIDGET_HEIGHT: 650,
        MAX_PAGE_NUMBER: 20,
        POLLING_INTERVAL: 6 * 60 * 60, // 6h
        // DEFAULT_FEED_PREFERENCE: EItemFeedPreference.Last,
    },
    PORTFOLIO: {
        DONUT_TOKENS_COUNT: 5,
        POLLING_INTERVAL: 30 * 60, // 30 min
        WIDGET_HEIGHT: 500,
        SMALL_PRICE_CUTOFF: 8, // display a max. of 8 digits for small numbers like $0.0000012
    },
    REPORTS: {
        WIDGET_HEIGHT: 500,
    },
    ROADMAP: {
        WIDGET_HEIGHT: 500,
    },
    TABLE: {
        MAX_PAGE_NUMBER: 10,
        WIDGET_HEIGHT: 400,
    },
    TWITTER: {
        WIDGET_HEIGHT: 570,
    },
    TVL: {
        TAG_ITEM_TYPE: "project",
        POLLING_INTERVAL: 180, // 3 min
        WIDGET_HEIGHT: 253,
    },
    VIDEO: {
        WIDGET_HEIGHT: 650,
        MAX_PAGE_NUMBER: 20,
        POLLING_INTERVAL: 6 * 60 * 60, // 6h
        // DEFAULT_FEED_PREFERENCE: EItemFeedPreference.Last,
    },
} as const;

export default WIDGETS_CONFIG;
