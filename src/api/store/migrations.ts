/**
 * notes on type safety
 * unfortunately it seems that redux-persist does not provide good TS
 * support for migration routines. So be careful when using migrations since
 * there is no type safety, migrations are any => any.
 * See https://github.com/rt2zz/redux-persist/issues/1065
 */

const migrations = {
    // eslint-disable-next-line
    11: (state: any): any => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                blog: {},
            },
        };
    }, // eslint-disable-next-line
    10: (state: any): any => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                video: {},
            },
        };
    },
    // eslint-disable-next-line
    9: (state: any): any => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                podcast: {},
            },
        };
    },
    // eslint-disable-next-line
    8: (state: any): any => {
        const { showTutorial } = state.ui;
        // eslint-disable-next-line no-param-reassign
        delete state.ui.showTutorial;
        return {
            ...state,
            ui: {
                ...state.ui,
                tutorial: {
                    showTutorial,
                    currentTutorial: undefined,
                },
            },
        };
    },
    // eslint-disable-next-line
    7: (state: any): any => {
        return {
            ...state,
            widgets: {
                ...state.widgets,
                news: {},
            },
        };
    },
    // eslint-disable-next-line
    6: (state: any): any => {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            selectedDate,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            eventFilters,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            minimisedWidgets,
            ...uiState
        } = state.ui;
        return {
            ...state,
            ui: uiState,
            widgets: {
                market: {
                    ...(state.widgets.market || {}),
                },
                portfolio: {},
                calendar: {},
                common: {},
            },
        };
    },
    5: <T>(state: T): T => {
        return {
            ...state,
            ui: {
                // @ts-expect-error
                ...state.ui,
                cookieChoice: undefined,
            },
            views: {},
        };
    },
    4: <T>(state: T): T => {
        return {
            ...state,
            user: {
                // @ts-expect-error
                ...state.user,
                settings: {
                    cookieChoice: undefined,
                },
            },
        };
    },
};

export default migrations;
