// keep z-index values in ascending order here
const Z_INDEX_REGISTRY = {
    AUDIO_PLAYER_DETAILS: 1,
    AUDIO_PLAYER_WRAP: 10,
    TOOLTIP_WRAPPER: 1,
    CALENDAR_LIST: 1,
    CALENDAR_EVENT_DETAILS: 2,
    SWITCH: 2,
    PORTFOLIO_ERROR_MSG: 2,
    CALENDAR_FILTER_TOGGLE: 2,
    TOOLTIP_LAYER: 3,
    MODULE_LOADER: 4, // widget loading spinner
    CALENDAR_TOOLBAR_BUTTON: 5,
    SCROLLBAR: 8,
    DRAGGABLE: 9,
    HEADER: 10,
    CALENDAR_EVENTS_TOOLTIP: 50,
    CALENDAR_EVENTS_TOOLTIP_FULLSIZE: 1050,
    PRELOADER: 99,
    CAROUSEL: 100,
    DATE_PICKER: 9_999,
    TOAST_CONTAINER: 9_999,
    ERROR_MODAL: 10_000,
    OVERLAY: 10_000,
    TUTORIAL_MODAL: 10_000,
    PODCAST_LIST: 1,
    VIDEO_LIST: 1,
    WIDGET_LIBRARY_DELETE: 999,
};

const UI_CONFIG = {
    DEFAULT_USER_AVATAR: "https://i.imgur.com/ffLy8ZH.png",
    SMALL_NUM_DECIMAL_PLACES: 4, // typically for n < 1
    BASE_DECIMAL_PLACES: 2,
    PERCENTAGE_DECIMAL_PLACES: 1,
    ETH_DECIMAL_PLACES: 6,
    USD_DECIMAL_PLACES: 2,
    SKELETON_VIEW: [
        ["news", "twitter"],
        ["portfolio", "market", "tvl", "gas"],
        ["calendar", "dao"],
    ],
    NEW_WIDGET_IDENTIFIER: "-wlib", // suffix to identify widgets from the widget library
    /**
     * total time duration in milliseconds for toasts
     * to be animated in & out and displayed to the user
     */
    TOAST_DURATION: 8000,
    Z_INDEX_REGISTRY,
    TUTORIAL_DELAY: 5000, // delay time after load to show tutorial
};

export default UI_CONFIG;
