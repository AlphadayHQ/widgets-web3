import { TZapperAsset } from "../api/services";

type TApiProvider = {
    API_KEY: string | undefined;
    API_BASE_URL: string;
    ROUTES?: Record<string, string>;
};
type TApiProviders = Record<string, TApiProvider>;

export const SUPPORTED_EVM_NETWORKS = {
    ethereum: {
        name: "ethereum",
        abbrev: "eth",
        icon: "",
        explorerUrl: "https://etherscan.io/token/",
    },
    polygon: {
        name: "polygon",
        abbrev: "poly",
        icon: "",
        explorerUrl: "https://polygonscan.com/token/",
    },
    optimism: {
        name: "optimism",
        abbrev: "op",
        icon: "",
        explorerUrl: "https://optimistic.etherscan.io/token/",
    },
    gnosis: {
        name: "gnosis",
        abbrev: "gno",
        icon: "",
        explorerUrl: "https://blockscout.com/token/",
    },
    "binance-smart-chain": {
        name: "binance-smart-chain",
        abbrev: "bsc",
        icon: "",
        explorerUrl: "https://www.bscscan.com/token/",
    },
    fantom: {
        name: "fantom",
        abbrev: "ftm",
        icon: "",
        explorerUrl: "https://ftmscan.com/token/",
    },
    avalanche: {
        name: "avalanche",
        abbrev: "Avax",
        icon: "",
        explorerUrl: "https://snowtrace.io/token/",
    },
    arbitrum: {
        name: "arbitrum",
        abbrev: "arb",
        icon: "",
        explorerUrl: "https://arbiscan.io/token/",
    },
    celo: {
        name: "celo",
        abbrev: "celo",
        icon: "",
        explorerUrl: "https://explorer.celo.org/token/",
    },
    harmony: {
        name: "harmony",
        abbrev: "one",
        icon: "",
        explorerUrl: "https://explorer.harmony.one/address/",
    },
    moonriver: {
        name: "moonriver",
        abbrev: "movr",
        icon: "",
        explorerUrl: "https://moonriver.moonscan.io/token/",
    },
    cronos: {
        name: "cronos",
        abbrev: "cron",
        icon: "",
        explorerUrl: "https://cronoscan.com/token/",
    },
    aurora: {
        name: "aurora",
        abbrev: "aur",
        icon: "",
        explorerUrl: "https://aurorascan.dev/token/",
    },
    evmos: {
        name: "evmos",
        abbrev: "evmos",
        icon: "",
        explorerUrl: "https://evm.evmos.org/token",
    },
};

const ZAPPER = {
    API_KEY: String(process.env.REACT_APP_ZAPPER_API_KEY),
    API_BASE_URL: String(process.env.REACT_APP_ZAPPER_BASE_URL),
    ROUTES: {
        TOKEN_BALANCES: "apps/tokens/balances",
        GAS_PRICES: "gas-prices",
    },
};
const ZAPPER_V2 = {
    API_KEY: String(process.env.REACT_APP_ZAPPER_API_KEY),
    API_BASE_URL: String(process.env.REACT_APP_ZAPPER_BASE_URL_V2),
    ROUTES: {
        TOKEN_BALANCES: "balances",
        NFT_BALANCES: "nft/balances/tokens",
    },
};

const DEFI_PULSE = {
    API_KEY: String(process.env.REACT_APP_DEFIPULSE_API_KEY),
    API_BASE_URL: String(process.env.REACT_APP_DEFIPULSE_BASE_URL),
};

const ETHERSCAN = {
    API_KEY: String(process.env.REACT_APP_ETHERSCAN_API_KEY),
    API_BASE_URL: String(process.env.REACT_APP_ETHERSCAN_BASE_URL),
};

const ETHPLORER = {
    API_KEY: String(process.env.REACT_APP_ETHPLORER_API_KEY),
    API_BASE_URL: "",
};

const COINGECKO = {
    API_KEY: undefined,
    API_BASE_URL: String(process.env.REACT_APP_COINGECKO_BASE_URL),
    ROUTES: {
        PRICE: "simple/price",
    },
};

const ULTRA_SOUND_MONEY = {
    API_KEY: undefined,
    API_BASE_URL: String(process.env.REACT_APP_ULTRA_SOUND_MONEY_BASE_URL),
};

const IPAPI = {
    API_KEY: undefined,
    API_BASE_URL: "https://ipapi.co/",
    ROUTES: {
        IP_METADATA: "json",
    },
};

const IPFS_GATEWAY = {
    API_KEY: undefined,
    API_BASE_URL: String(process.env.REACT_APP_ALPHADAY_IPFS_GATEWAY),
};

export const API_PROVIDERS: TApiProviders = {
    ZAPPER,
    ZAPPER_V2,
    DEFI_PULSE,
    ETHERSCAN,
    ETHPLORER,
    COINGECKO,
    ULTRA_SOUND_MONEY,
    IPAPI,
    IPFS_GATEWAY,
};

export const EXPLORERS = {
    TOKEN_METADATA_URL: (asset: TZapperAsset): string => {
        /**
         * Zapper returns 0x000000000... for some native coins contract address
         * e.g AVAX has 0x0000000.. but this is not the true
         * contract address except in the case of ethereum
         * so we point to coingecko instead.
         */
        const zapperCoinGeckoMap = {
            ETH: "ethereum",
            AVAX: "avalanche",
            CELO: "celo",
            FTM: "fantom",
            BNB: "bnb",
            CRONOS: "cronos",
            EVMOS: "evmos",
            GNO: "gnosis",
            MOVR: "moonriver",
            MATIC: "polygon",
        };
        const geckoCoin =
            zapperCoinGeckoMap[
                asset.context.symbol as keyof typeof zapperCoinGeckoMap
            ];
        if (geckoCoin) return `https://www.coingecko.com/en/coins/${geckoCoin}`;
        const explorer: string =
            SUPPORTED_EVM_NETWORKS[
                asset.network as keyof typeof SUPPORTED_EVM_NETWORKS
            ].explorerUrl;
        return `${explorer}${asset.address}`;
    },
    COINGECKO_URL: (coin: string): string =>
        `https://www.coingecko.com/en/coins/${coin}`,
    GECKO_COINS: {
        ETH: "ethereum",
        AVAX: "avalanche",
        CELO: "celo",
        FTM: "fantom",
        BNB: "bnb",
        CRONOS: "cronos",
        EVMOS: "evmos",
        GNO: "gnosis",
        MOVR: "moonriver",
        MATIC: "polygon",
    },
};
