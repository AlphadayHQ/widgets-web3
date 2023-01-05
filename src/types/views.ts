/**
 * for views (and perhaps all user data) we exceptionally use types as defined
 * by the backend API, so these are just aliases of the types from services/
 */
import { ReactNode } from "react";
import {
    TRemoteUserView,
    TRemoteUserViewWidget,
    TRemoteUserViewWidgetSetting,
    IRemoteWidget,
    TRemoteWidgetSetting,
    TRemoteUserViewDraft,
    TRemoteSourceData,
} from "./widgetTypes";
import { TKeyword } from "./primitives";

export type TWidgetSetting = TRemoteWidgetSetting;

export type TWidget = IRemoteWidget;

export type TUserViewWidgetSetting = TRemoteUserViewWidgetSetting;

export type TUserViewWidget<T = unknown> = TRemoteUserViewWidget<T>;

export type TUserView = Omit<TRemoteUserView, "keywords"> & {
    keywords: TKeyword[];
};

export type TUserViewDraft = TRemoteUserViewDraft;

export type TSourceData = TRemoteSourceData;

export type TCounterData = {
    date: string;
    announcement: string;
    block_height?: string;
    items?: {
        title: ReactNode;
        value: ReactNode;
    }[][];
};

export type TCachedView = {
    lastSynced: string | undefined; // iso string
    lastModified: string | undefined; // iso string
    isReadOnly?: boolean;
    data: TUserView; // | TUserViewDraft;
};

export enum EViewDialogState {
    Closed,
    Save,
    Remove,
    Busy,
    Error,
    LimitReached,
}
