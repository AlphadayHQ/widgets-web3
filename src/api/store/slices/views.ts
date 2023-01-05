import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { TCachedView, TKeyword, ETag, TTag } from "../../../api/types";
import { logout } from "../../../api/services/user/userEndpoints";
import { RootState } from "../../../api/store/store";
import { Logger } from "../../../api/utils/logging";
import { isViewModified } from "../../../api/utils/viewUtils";

export interface IViewsState {
    selectedViewId: number | undefined;
    prevSelectedViewId: number | undefined;
    viewsCache: Record<number, TCachedView> | undefined;
    sharedViewsCache: Record<number, TCachedView> | undefined;
}

const initialState: IViewsState = {
    selectedViewId: undefined,
    prevSelectedViewId: undefined,
    viewsCache: undefined,
    sharedViewsCache: undefined,
};

const viewsSlice = createSlice({
    name: "views",
    initialState,
    reducers: {
        setSelectedViewId(draft, action: PayloadAction<number | undefined>) {
            const { payload } = action;
            draft.prevSelectedViewId = draft.selectedViewId;
            draft.selectedViewId = payload;
        },
        setViewsCache(
            draft,
            action: PayloadAction<Record<number, TCachedView> | undefined>
        ) {
            const { payload } = action;
            draft.viewsCache = payload;
        },
        setSharedViewsCache(
            draft,
            action: PayloadAction<Record<number, TCachedView> | undefined>
        ) {
            const { payload } = action;
            draft.sharedViewsCache = payload;
        },
        setViewKeywords(draft, action: PayloadAction<TKeyword[]>) {
            const { payload } = action;
            if (
                draft.selectedViewId === undefined ||
                draft.viewsCache === undefined
            ) {
                Logger.warn(
                    "slices::views: attempted to set keywords but no view is selected"
                );
                return;
            }
            const currView = draft.viewsCache[draft.selectedViewId];
            if (currView === undefined) return;
            currView.data.keywords = payload;
            currView.lastModified = new Date().toISOString();
        },
        /**
         * Add a keyword to the current view
         * Add this keyword's tag to all view widgets
         */
        addKeywordToViewWidgets(draft, action: PayloadAction<TKeyword>) {
            const { payload } = action;
            if (
                draft.selectedViewId === undefined ||
                draft.viewsCache === undefined
            ) {
                Logger.warn(
                    "slices::views::addKeywordToViewWidgets: attempted to add keywords but no view is selected"
                );
                return;
            }
            const currView = draft.viewsCache[draft.selectedViewId];
            if (currView === undefined) return;

            // update widgets' tag preferences
            const viewWidgets = currView.data.widgets;
            const tagFromKeyword = payload.tag;
            for (let i = 0; i < viewWidgets.length; i += 1) {
                const tagsSettings = viewWidgets[i].settings.filter(
                    (s) => s.setting.slug === "included_tags_setting"
                );
                if (tagsSettings[0]) {
                    const widgetTags = tagsSettings[0].tags;
                    if (tagFromKeyword == null) {
                        /**
                         * When tags from keywords are empty,
                         * we want to keep all tags that were persisted in storage
                         * To do this, we avoid mutating the widget's tags
                         */
                        // eslint-disable-next-line
                        continue;
                    }
                    // add tag only if it's not already there
                    if (
                        !widgetTags
                            .map((wt) => wt.id)
                            .includes(tagFromKeyword.id)
                    ) {
                        widgetTags.push({
                            ...tagFromKeyword,
                            tag_type: ETag.Global,
                        });
                    }
                }
            }
            currView.lastModified = new Date().toISOString();
        },
        removeTagFromViewWidget(
            draft,
            action: PayloadAction<{ widgetHash: string; tagId: number }>
        ) {
            const { widgetHash, tagId } = action.payload;
            if (
                draft.selectedViewId === undefined ||
                draft.viewsCache === undefined
            ) {
                Logger.error(
                    "slices::views::removeTagFromWidget: selectedView is undefined, should never happen"
                );
                return;
            }
            const selectedView = draft.viewsCache[draft.selectedViewId];
            if (selectedView === undefined) return;
            const widget = selectedView.data.widgets.find(
                (w) => w.hash === widgetHash
            );
            if (widget === undefined) {
                Logger.error(
                    "slices::views::removeTagFromWidget: could not find widget. Should never happen"
                );
                return;
            }
            const widgetTagSettings = widget.settings.find(
                (s) => s.setting.slug === "included_tags_setting"
            );
            if (widgetTagSettings === undefined) {
                Logger.error(
                    "slices::views::removeTagFromWidget: could not get widget tag settings"
                );
                return;
            }
            widgetTagSettings.tags = widgetTagSettings.tags.filter(
                (t) => t.id !== tagId
            );
            selectedView.lastModified = new Date().toISOString();
            Logger.debug(
                "slices::views::removeTagFromWidget: widget tags have been updated"
            );
        },
        includeTagInViewWidget(
            draft,
            action: PayloadAction<{ widgetHash: string; tag: TTag }>
        ) {
            const { widgetHash, tag } = action.payload;
            if (
                draft.selectedViewId === undefined ||
                draft.viewsCache === undefined
            ) {
                Logger.error(
                    "slices::views::includeTagInViewWidget: selectedView is undefined, should never happen"
                );
                return;
            }
            const selectedView = draft.viewsCache[draft.selectedViewId];
            if (selectedView === undefined) return;
            const widget = selectedView.data.widgets.find(
                (w) => w.hash === widgetHash
            );
            if (widget === undefined) {
                Logger.error(
                    "slices::views::includeTagInViewWidget: could not find widget. Should never happen"
                );
                return;
            }
            const widgetTagSettings = widget.settings.find(
                (s) => s.setting.slug === "included_tags_setting"
            );
            if (widgetTagSettings === undefined) {
                Logger.error(
                    "slices::views::includeTagInViewWidget: could not get widget tag settings"
                );
                return;
            }

            // if the tag already exists, it means it was added from the widget
            // settings, in which case we change it from global to local
            const existingTag = widgetTagSettings.tags.find(
                (t) => t.id === tag.id
            );
            if (
                existingTag !== undefined &&
                existingTag.tag_type === ETag.Global
            ) {
                existingTag.tag_type = ETag.Local;
                return;
            }
            widgetTagSettings.tags.push({ ...tag, tag_type: tag.tagType });
            selectedView.lastModified = new Date().toISOString();
            Logger.debug(
                "slices::views::includeTagInViewWidget: widget tags have been updated"
            );
        },
        removeTagFromAllWidgets(
            draft,
            action: PayloadAction<{ tagId: number }>
        ) {
            const { tagId } = action.payload;
            if (
                draft.selectedViewId === undefined ||
                draft.viewsCache === undefined ||
                draft.viewsCache[draft.selectedViewId] === undefined
            ) {
                Logger.warn("slices::views::removeTag: no view selected");
                return;
            }
            const currView = draft.viewsCache[draft.selectedViewId];
            let viewWasModified = false;
            for (let i = 0; i < currView.data.widgets.length; i += 1) {
                const widgetTagSettings = currView.data.widgets[
                    i
                ].settings.find(
                    (s) => s.setting.slug === "included_tags_setting"
                );
                if (widgetTagSettings !== undefined) {
                    widgetTagSettings.tags = widgetTagSettings.tags.filter(
                        (t) => t.id !== tagId || t.tag_type === ETag.Local
                    );
                    viewWasModified = true;
                }
            }
            if (viewWasModified) {
                currView.lastModified = new Date().toISOString();
                Logger.debug(
                    "slices::views::removeTagFromAllWidgets: tags have been updated"
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(logout.matchFulfilled, (_draft) => {
            return initialState;
        });
    },
});

/**
 * views selectors
 */

export const userAndSharedViewsCacheSelector: (
    state: RootState
) => Record<number, TCachedView> | undefined = createSelector(
    (state) => state.views.viewsCache,
    (state) => state.views.sharedViewsCache,
    (viewsCache, sharedViewsCache) => ({
        ...viewsCache,
        ...sharedViewsCache,
    })
);

export const selectedViewSelector: (
    state: RootState
) => TCachedView | undefined = createSelector(
    (state) => state.views.selectedViewId,
    userAndSharedViewsCacheSelector,
    (selectedViewId, userAndSharedViewsCache) => {
        if (selectedViewId === undefined) {
            return undefined;
        }
        return userAndSharedViewsCache?.[selectedViewId];
    }
);

export const keywordSearchListSelector: (
    state: RootState
) => TKeyword[] = createSelector(
    (state) => state.views.selectedViewId,
    (state) => state.views.viewsCache,
    (selectedViewId, viewsCache) => {
        if (selectedViewId === undefined || viewsCache === undefined) {
            return [];
        }
        if (viewsCache[selectedViewId]) {
            return viewsCache[selectedViewId].data.keywords;
        }
        return [];
    }
);

export const isViewModifiedSelector: (
    state: RootState
) => boolean = createSelector(selectedViewSelector, (selectedView) => {
    if (selectedView === undefined) {
        return false;
    }
    return isViewModified(selectedView);
});

export const {
    setSelectedViewId,
    setViewsCache,
    setSharedViewsCache,
    setViewKeywords,
    addKeywordToViewWidgets,
    removeTagFromViewWidget,
    removeTagFromAllWidgets,
    includeTagInViewWidget,
} = viewsSlice.actions;
export default viewsSlice.reducer;
