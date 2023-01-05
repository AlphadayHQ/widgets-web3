import { useCallback, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../api/store/hooks";
import moment from "moment";
import { EWidgetSettingsRegistry } from "../../types/widgetContainer";
import * as viewsStore from "../../api/store/slices/views";
import CONFIG from "../../config";
import {
    useGetViewsQuery,
    useSaveViewMutation,
    useSaveViewAsMutation,
    useDeleteViewMutation,
    TRemoteUserView,
} from "../../api/services";
import {
    TUserView,
    TCachedView,
    EViewDialogState,
    TUserViewWidget,
    TTag,
} from "../../api/types";
import { Logger } from "../../api/utils/logging";
import { remoteViewAsCachedView } from "../../api/utils/viewUtils";
import { toast } from "../utils/toastUtils";
import { removeWidgetStateFromCache } from "../store";

const TRUE_HASH_LEN = 32;

const computeUpdatedViewsCache = (
    viewsCache: Record<number, TCachedView> | undefined,
    remoteViews: TUserView[]
): Record<number, TCachedView> => {
    const draftViewsCache: Record<number, TCachedView> = {};
    remoteViews.forEach((remoteView) => {
        const prevState = viewsCache ? viewsCache[remoteView.id] : undefined;
        if (!remoteView.is_system_view && prevState) {
            // if lastModified = undefined, assume it was modified at the
            // beginning of time
            const lastModified = moment(prevState.lastModified || 0);
            const lastSaved = moment(remoteView.updated_at);
            const data = lastModified.isAfter(lastSaved)
                ? {
                      ...remoteView,
                      ...prevState.data,
                  }
                : {
                      ...prevState.data,
                      ...remoteView,
                  };
            draftViewsCache[remoteView.id] = {
                ...prevState,
                lastSynced: new Date().toISOString(),
                data,
            };
        } else {
            draftViewsCache[remoteView.id] = {
                lastModified: undefined,
                lastSynced: new Date().toISOString(),
                data: {
                    ...remoteView,
                },
            };
        }
    });
    return draftViewsCache;
};

interface IView {
    availableViews: ReadonlyArray<TCachedView> | undefined;
    refetchViews: () => void;
    selectedView: TCachedView | undefined;
    setSelectedViewId: (id: number) => void;
    isViewModified: boolean;
    dialogState: EViewDialogState;
    openSaveViewDialog: () => void;
    openRemoveViewDialog: () => void;
    closeViewDialog: () => void;
    dialogErrorMessage: string | undefined;
    saveView: (viewName?: string) => void;
    removeView: (viewId: number) => void;
    addSharedViewToCache: (view: TRemoteUserView) => void;
    removeSharedViewFromCache: (id: number) => void;
    removeWidgetFromCache: (hash: string) => void;
    addWidgetsToCache: (w: TUserViewWidget[]) => void;
    removeTagFromViewWidget: (viewHash: string, tagId: number) => void;
    includeTagInViewWidget: (viewHash: string, tag: TTag) => void;
}
interface IUseViewParams {
    /**
     * used to prevent all consumer components to dispatch state changes in
     * views cache
     */
    canUpdateView: boolean;
}
export const useView: (params?: IUseViewParams) => IView = (params) => {
    const dispatch = useAppDispatch();
    const savedViewRef = useRef<number | undefined>();

    const { data: remoteViews, refetch: refetchViews } = useGetViewsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const selectedViewId = useAppSelector(
        (state) => state.views.selectedViewId
    );

    const setSelectedViewId = useCallback(
        (id: number | undefined) => {
            dispatch(viewsStore.setSelectedViewId(id));
        },
        [dispatch]
    );

    const viewsCache = useAppSelector((state) => state.views.viewsCache);

    const sharedViewsCache = useAppSelector(
        (state) => state.views.sharedViewsCache
    );

    const userAndSharedViewsCache = useAppSelector(
        viewsStore.userAndSharedViewsCacheSelector
    );

    // note: availableViews also contains views that have been shared to
    // the user!
    const availableViews = userAndSharedViewsCache
        ? Object.values(userAndSharedViewsCache)
        : undefined;

    const isViewModified = useAppSelector(viewsStore.isViewModifiedSelector);

    const selectedView = useAppSelector(viewsStore.selectedViewSelector);

    const [saveViewMut] = useSaveViewMutation();
    const [saveViewAsMut] = useSaveViewAsMutation();
    const [deleteViewMut] = useDeleteViewMutation();

    const [dialogState, setDialogState] = useState<EViewDialogState>(
        EViewDialogState.Closed
    );

    const [dialogErrorMessage, setDialogErrorMessage] = useState<
        string | undefined
    >();

    const closeViewDialog = () => setDialogState(EViewDialogState.Closed);

    /**
     * add shared view to cache
     */
    const addSharedViewToCache = (view: TRemoteUserView) => {
        const shardViewsCacheCopy = { ...sharedViewsCache };
        shardViewsCacheCopy[view.id] = {
            ...remoteViewAsCachedView(view),
            isReadOnly: true,
        };
        dispatch(viewsStore.setSharedViewsCache(shardViewsCacheCopy));
    };

    const removeSharedViewFromCache = (viewId: number) => {
        Logger.debug("useView::removeSharedViewFromCache called");
        const sharedViewsCacheCopy = { ...sharedViewsCache };
        delete sharedViewsCacheCopy[viewId];
        dispatch(viewsStore.setSharedViewsCache(sharedViewsCacheCopy));
        if (selectedViewId === viewId) {
            dispatch(
                viewsStore.setSelectedViewId(
                    remoteViews ? remoteViews[0].id : undefined
                )
            );
        }
    };

    /**
     * save/save as actions
     */

    const openSaveViewDialog = () => setDialogState(EViewDialogState.Save);

    /*
     * if viewName is provided -> save as
     * else -> save
     */
    const saveView = (viewName?: string) => {
        try {
            const isSaveAs = viewName !== undefined;
            setDialogState(EViewDialogState.Busy);
            if (selectedView === undefined) {
                throw new Error("useView::saveView::selectedView is null");
            }
            const viewData = { ...selectedView.data };
            Logger.debug("useView::saveView: called", viewData);

            // if this is a new board, get last sort_order and increment it
            let sortOrder: number | undefined;
            if (viewsCache && isSaveAs) {
                const sortNumbers = Object.values(viewsCache)
                    .map((view) => view.data.sort_order)
                    .sort();
                sortOrder = sortNumbers[sortNumbers.length - 1];
                if (sortOrder) sortOrder += 1;
            }
            const {
                id,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                hash: viewHash,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                slug: viewSlug,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                icon: viewIcon,
                keywords,
                ...restViewData
            } = viewData;
            const body = {
                ...restViewData,
                sort_order: sortOrder || restViewData.sort_order,
                name: viewName !== undefined ? viewName : restViewData.name,
                widgets: restViewData.widgets.map((widget) => {
                    const { hash, ...restWidgetData } = widget;
                    return {
                        ...restWidgetData,
                        // omitt hash field for new widgets
                        // recall: new widgets from widget library use a
                        // temporal unique identifier whose length != TRUE_HASH_LEN
                        ...(hash.length === TRUE_HASH_LEN && { hash }),
                        widget: {
                            slug: widget.widget.slug,
                            settings: widget.widget.settings,
                        },
                        settings: widget.settings.map((s) => ({
                            setting: {
                                slug: s.setting.slug,
                            },
                            tags: s.tags.map((t) => ({
                                slug: t.slug,
                                name: t.name,
                                tag_type: t.tag_type,
                            })),
                            toggle_value: s.toggle_value,
                        })),
                    };
                }),
                keywords: keywords.map((keyword) => ({
                    id: keyword.id,
                })),
            };
            Logger.debug("useView::saveView::body:", body);

            const { max_widgets: maxWidgets } = selectedView.data;
            const MAX_WIDGETS = maxWidgets ?? CONFIG.VIEWS.MAX_WIDGETS;

            if (body.widgets.length > MAX_WIDGETS) {
                setDialogState(EViewDialogState.LimitReached);
                setDialogErrorMessage(
                    `View cannot have more than ${String(MAX_WIDGETS)} widgets.`
                );
                return;
            }

            if (!isSaveAs) {
                saveViewMut({
                    id,
                    body,
                })
                    .unwrap()
                    .then((response) => {
                        Logger.debug(
                            "useView::saveView::saveViewMut: success. Response:",
                            response
                        );
                        savedViewRef.current = response.id;
                        setDialogState(EViewDialogState.Closed);
                        toast(`Saved ${response.name} View settings`, {
                            status: "alert",
                        });
                    })
                    .catch((rejected) => {
                        Logger.error(
                            "useView::saveView::saveViewMut::rejected:",
                            rejected
                        );
                        setDialogState(EViewDialogState.Error);
                        setDialogErrorMessage(
                            "Error trying to save board. Please try again later."
                        );
                    });
            } else {
                saveViewAsMut(body)
                    .unwrap()
                    .then((response) => {
                        Logger.debug(
                            "useView::saveView::saveViewAsMut: success. Response:",
                            response
                        );
                        savedViewRef.current = response.id;
                        setDialogState(EViewDialogState.Closed);
                        toast(`Created new Board: ${response.name}`, {
                            status: "alert",
                        });
                        // update browser history
                        history.pushState(null, "", "/");
                    })
                    .catch((rejected) => {
                        Logger.error(
                            "useView::saveView::saveViewAsMut: error",
                            rejected
                        );
                        setDialogState(EViewDialogState.Error);
                        setDialogErrorMessage(
                            "Error trying to save board. Please try again later."
                        );
                    });
            }
        } catch (e) {
            Logger.error("useView::saveView: Unexpected error", e);
            setDialogState(EViewDialogState.Error);
            setDialogErrorMessage(
                "An unexpected error ocurred trying to save board. Please try again later."
            );
        }
    };

    /**
     * remove view actions
     */

    const openRemoveViewDialog = () => setDialogState(EViewDialogState.Remove);

    const removeView = (viewId: number) => {
        setDialogState(EViewDialogState.Busy);
        deleteViewMut({ id: viewId })
            .unwrap()
            .then((response) => {
                Logger.debug(
                    "useView::removeView::deleteViewMut: success. Response:",
                    response
                );
                const viewsCacheCopy = { ...viewsCache };
                const updatedCache: Record<number, TCachedView> = {};
                Object.values(viewsCacheCopy).forEach((view) => {
                    if (view.data.id !== viewId)
                        updatedCache[view.data.id] = { ...view };
                });
                dispatch(viewsStore.setViewsCache(updatedCache));
                if (selectedViewId === viewId) {
                    dispatch(
                        viewsStore.setSelectedViewId(
                            remoteViews ? remoteViews[0].id : undefined
                        )
                    );
                }
                setDialogState(EViewDialogState.Closed);
                toast("View successfully removed", {
                    status: "alert",
                });
            })
            .catch((e) => {
                Logger.error("useView::removeView: Unexpected error", e);
                setDialogState(EViewDialogState.Error);
                setDialogErrorMessage(
                    "An unexpected error ocurred trying to remove the board. Please try again later."
                );
            });
    };

    /**
     * add/remove widget from view actions
     */

    const removeWidgetFromCache = useCallback(
        (moduleHash: string) => {
            if (viewsCache === undefined || selectedViewId === undefined) {
                Logger.error(
                    "useView::removeWidgetFromCache: viewsCache or selectedView is undefined. Should never happen"
                );
                return;
            }

            // The widget hash is always unique even for widgets from the widget library
            if (selectedView?.data.widgets) {
                const newView: TCachedView = {
                    ...selectedView,
                    data: {
                        ...selectedView.data,
                        widgets: selectedView.data.widgets.filter(
                            (widget) => widget.hash !== moduleHash
                        ),
                    },
                    lastModified: new Date().toISOString(),
                };
                const viewsCacheCopy = { ...viewsCache };
                viewsCacheCopy[selectedViewId] = newView;

                dispatch(viewsStore.setViewsCache(viewsCacheCopy));
                // Remove widget State from cache
                dispatch(
                    removeWidgetStateFromCache({ widgetHash: moduleHash })
                );
            }
        },
        [dispatch, selectedView, selectedViewId, viewsCache]
    );

    const addWidgetsToCache = useCallback(
        (widgets: TUserViewWidget[]) => {
            Logger.debug("useView::addWidgetsToCache called");
            if (viewsCache === undefined || selectedViewId === undefined) {
                Logger.error(
                    "useView::removeWidgetFromCache: viewsCache or selectedView is undefined. Should never happen"
                );
                return;
            }

            // The widget hash is always unique even for widgets from the widget library
            if (selectedView?.data.widgets) {
                const hashArray = widgets.map((e) => e.hash);

                const newView: TCachedView = {
                    ...selectedView,
                    data: {
                        ...selectedView.data,
                        // first remove widget if it already exists
                        widgets: [
                            ...selectedView.data.widgets.filter(
                                (w) => !hashArray.includes(w.hash)
                            ),
                            ...widgets,
                        ],
                    },
                    lastModified: new Date().toISOString(),
                };

                const viewsCacheCopy = { ...viewsCache };
                viewsCacheCopy[selectedViewId] = newView;

                dispatch(viewsStore.setViewsCache(viewsCacheCopy));
            }
        },
        [dispatch, selectedView, selectedViewId, viewsCache]
    );
    /**
     * remove tag from view widget
     * note: tags are added to widgets through the global search bar. (see
     * useGlobalSearch::setKeywordSearchList)
     */
    const removeTagFromViewWidget = useCallback(
        (widgetHash: string, tagId: number) => {
            const widgetsWithTag = selectedView?.data.widgets.filter((w) => {
                const widgetTagSettings = w.settings.find(
                    (s) =>
                        s.setting.slug === EWidgetSettingsRegistry.IncludedTags
                );
                if (!widgetTagSettings) return false;

                return widgetTagSettings.tags.find((tag) => tag.id === tagId);
            });

            const currentWidgetSetting = widgetsWithTag
                ?.find((w) => w.hash === widgetHash)
                ?.settings.find(
                    (s) =>
                        s.setting.slug === EWidgetSettingsRegistry.IncludedTags
                );

            /**
             * If there is only 1 widget with a tag, and
             * removeTagFromViewWidget is called we should also
             * remove it from the view keywords list
             */
            if (
                widgetsWithTag?.length === 1 &&
                currentWidgetSetting?.tags.length === 1 && // if there is only 1 tag in the widget
                selectedView?.data.keywords?.length // only remove if there are keywords
            ) {
                const updatedKeywords = selectedView?.data.keywords.filter(
                    (kw) => kw.tag.id !== tagId
                );

                if (updatedKeywords)
                    dispatch(viewsStore.setViewKeywords(updatedKeywords));
            }
            dispatch(viewsStore.removeTagFromViewWidget({ widgetHash, tagId }));
        },
        [dispatch, selectedView?.data.keywords, selectedView?.data.widgets]
    );

    const includeTagInViewWidget = useCallback(
        (widgetHash: string, tag: TTag) => {
            dispatch(
                viewsStore.includeTagInViewWidget({
                    widgetHash,
                    tag,
                })
            );
        },
        [dispatch]
    );

    useEffect(() => {
        if (remoteViews && selectedViewId === undefined) {
            setSelectedViewId(remoteViews[0].id);
        } else if (remoteViews && savedViewRef.current) {
            setSelectedViewId(savedViewRef.current);
            savedViewRef.current = undefined;
        }
    }, [remoteViews, selectedViewId, setSelectedViewId]);

    useEffect(() => {
        // viewsCache would create a circular dependency
        // TODO: we should probably refactor computeUpdatedViewsCache and update
        // views cache state in store instead
        if (
            remoteViews &&
            (params?.canUpdateView === true || viewsCache === undefined)
        ) {
            Logger.debug("useView::computeUpdatedViewsCache called");
            dispatch(
                viewsStore.setViewsCache(
                    computeUpdatedViewsCache(viewsCache, [
                        ...remoteViews.map((r) => ({
                            ...r,
                            keywords: r.keywords.map((kw) => ({
                                ...kw,
                                tag: { ...kw.tag, tagType: kw.tag.tag_type },
                            })),
                        })),
                    ])
                )
            );
        }
        /**
         * By depending on `viewsCache === undefined`, we ensure we prevent max-depth call error
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remoteViews, params?.canUpdateView, viewsCache === undefined]);

    return {
        availableViews,
        refetchViews,
        selectedView,
        setSelectedViewId,
        isViewModified,
        dialogState,
        closeViewDialog,
        dialogErrorMessage,
        openSaveViewDialog,
        saveView,
        openRemoveViewDialog,
        removeView,
        addSharedViewToCache,
        removeSharedViewFromCache,
        removeWidgetFromCache,
        addWidgetsToCache,
        removeTagFromViewWidget,
        includeTagInViewWidget,
    };
};
