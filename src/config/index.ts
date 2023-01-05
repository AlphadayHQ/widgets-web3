import UI_CONFIG from "./ui";
import VIEWS_CONFIG from "./views";
import WIDGETS_CONFIG from "./widgets";
import { API_PROVIDERS, EXPLORERS } from "./thirdparty";
import API_CONFIG from "./backend";



export enum EEnvironments {
  Test = "test",
  Development = "dev",
  Staging = "staging",
  Production = "production",
}

const IS_TEST = process.env.REACT_APP_ENVIRONMENT === EEnvironments.Test;
const IS_DEV =
  process.env.REACT_APP_ENVIRONMENT === EEnvironments.Development ||
  !process.env.REACT_APP_ENVIRONMENT;
const IS_STAGING = process.env.REACT_APP_ENVIRONMENT === EEnvironments.Staging;
const IS_PROD = process.env.REACT_APP_ENVIRONMENT === EEnvironments.Production;

const LOGLEVEL =
  process.env.REACT_APP_LOGLEVEL != null
    ? parseInt(process.env.REACT_APP_LOGLEVEL, 10)
    : 0;
const TWITTER_LIST_ID = String(process.env.REACT_APP_TWITTER_LIST_ID);

const SENTRY = {
  DSN: process.env.REACT_APP_SENTRY_DSN,
  ENABLE: true,
};

const COOKIES = {
  // in these, a "reject all" option will be included
  STRICT_COUNTRY_LIST: ["DE", "FR", "UK", "IE"],
};


const CONFIG = {
  IS_TEST,
  IS_DEV,
  IS_STAGING,
  IS_PROD,
  LOGLEVEL,
  TWITTER_LIST_ID,
  API: API_CONFIG,
  WIDGETS: WIDGETS_CONFIG,
  UI: UI_CONFIG,
  VIEWS: VIEWS_CONFIG,
  API_PROVIDERS,
  EXPLORERS,
  SENTRY,
  COOKIES,
  APP: {
    VERSION: process.env.REACT_APP_VERSION || "",
    STORAGE_KEY: "alphaday",
    STORAGE_VERSION: 11,
    COMMIT: process.env.REACT_APP_COMMIT,
  },
};

export default CONFIG;
