import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TTheme } from "../../../styles/types";
import { ECookieChoice, TTutorialTip } from "../../../api/types";

export interface ITutorialState {
    showTutorial: boolean | undefined;
    currentTutorialTip: TTutorialTip | undefined;
}
export interface IUIState {
    theme: TTheme;
    showWidgetLib: boolean;
    showBalance: boolean;
    tutorial: ITutorialState;
    cookieChoice: ECookieChoice | undefined;
}

const initialState: IUIState = {
    theme: "dark",
    showWidgetLib: false,
    showBalance: true,
    tutorial: { showTutorial: undefined, currentTutorialTip: undefined },
    cookieChoice: undefined,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleTheme(draft, action: PayloadAction<{ theme: TTheme }>) {
            const {
                payload: { theme },
            } = action;

            draft.theme = theme;
        },
        toggleShowWidgetLib(draft) {
            draft.showWidgetLib = !draft.showWidgetLib;
        },
        toggleShowBalance(draft) {
            draft.showBalance = !draft.showBalance;
        },
        setStoreShowTutorial(draft, action: PayloadAction<{ show: boolean }>) {
            const {
                payload: { show },
            } = action;
            draft.tutorial.showTutorial = show;
        },
        setCurrentTutorialTip(
            draft,
            action: PayloadAction<{ tutorialTip: TTutorialTip }>
        ) {
            const {
                payload: { tutorialTip },
            } = action;
            draft.tutorial.currentTutorialTip = tutorialTip;
        },
        setCookieChoice(
            draft,
            action: PayloadAction<ECookieChoice | undefined>
        ) {
            draft.cookieChoice = action.payload;
        },
    },
});

export const {
    toggleTheme,
    toggleShowWidgetLib,
    toggleShowBalance,
    setStoreShowTutorial,
    setCurrentTutorialTip,
    setCookieChoice,
} = uiSlice.actions;
export default uiSlice.reducer;
