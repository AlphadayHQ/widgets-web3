import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ICommonWidgetState {
    isMinimised: boolean;
}


export interface IPortfolioWidgetState {
    showAllAssets: boolean;
}


export interface IWidgetsState {
    common: Record<string, ICommonWidgetState>;
    portfolio: Record<string, IPortfolioWidgetState>;
}

const initialState: IWidgetsState = {
    common: {},
    portfolio: {},
};

const widgetsSlice = createSlice({
    name: "widgets",
    initialState,
    reducers: {
        toggleCollapse(
            draft,
            action: PayloadAction<{
                widgetHash: string;
            }>
        ) {
            const {
                payload: { widgetHash },
            } = action;
            draft.common = {
                ...draft.common,
                [widgetHash]: {
                    ...(draft.common[widgetHash] ?? {}),
                    isMinimised: !draft.common[widgetHash]?.isMinimised,
                },
            };
        },
        toggleShowAllAssets(
            draft,
            action: PayloadAction<{
                widgetHash: string;
            }>
        ) {
            const {
                payload: { widgetHash },
            } = action;
            draft.portfolio = {
                ...draft.portfolio,
                [widgetHash]: {
                    ...(draft.portfolio[widgetHash] ?? {}),
                    showAllAssets: !draft.portfolio[widgetHash]?.showAllAssets,
                },
            };
        },
        removeWidgetStateFromCache(
            draft,
            action: PayloadAction<{
                widgetHash: string;
            }>
        ) {
            const {
                payload: { widgetHash },
            } = action;

            Object.values(draft).forEach((widgetState) => {
                // eslint-disable-next-line no-param-reassign
                if (widgetHash in widgetState) delete widgetState[widgetHash];
            });
        },
    },
});

export const {
    toggleCollapse,
    toggleShowAllAssets,
    removeWidgetStateFromCache,
} = widgetsSlice.actions;
export default widgetsSlice.reducer;

/**
 * selectors
 */

export const selectShowAllAssets = (widgetHash: string) => (
    state: RootState
): boolean => !!state.widgets.portfolio[widgetHash]?.showAllAssets;

export const selectIsMinimised = (widgetHash: string) => (
    state: RootState
): boolean => !!state.widgets.common[widgetHash]?.isMinimised;
