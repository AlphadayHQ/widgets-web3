import queryString from "querystring";
import { Logger } from "../../../api/utils/logging";
import { TEMPLATES_DICT } from "../../../types/widgetContainer";
import { alphadayApi } from "../alphadayApi";
import {
    TRemoteUserView,
    TRemoteUserViewWidget,
    TViewsRequest,
    TViewsResponse,
    TViewByIdRequest,
    TViewByIdResponse,
    TSaveViewAsRequest,
    TSaveViewAsResponse,
    TSaveViewRequest,
    TSaveViewResponse,
    TDeleteViewRequest,
    TDeleteViewResponse,
    TWidgetsRequest,
    TWidgetsResponse,
    TWidgetByIdRequest,
    TWidgetByIdResponse,
    TViewByHashOrSlugRequest,
    TViewByHashOrSlugResponse,
    TWidgetsCategoryResponse,
    TWidgetsCategoryRequest,
} from "./types";
import CONFIG from "../../../config";

const { VIEWS } = CONFIG.API.DEFAULT.ROUTES;

const viewCheck = (view: TRemoteUserView): TRemoteUserView => {
    const viewWidgets = [...view.widgets];
    const filteredWidgets: TRemoteUserViewWidget[] = [];
    viewWidgets.forEach((viewWidget) => {
        if (!(viewWidget.widget.template.slug in TEMPLATES_DICT)) {
            Logger.warn(
                "viewsEndpoints::viewCheck: unknown widget template found:",
                viewWidget.widget.template.slug
            );
        } else {
            filteredWidgets.push(viewWidget);
        }
    });
    return {
        ...view,
        widgets: filteredWidgets,
    };
};

const tagsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getViews: builder.query<TViewsResponse, TViewsRequest>({
            query: () => {
                Logger.debug(
                    "getViews: querying",
                    `${VIEWS.BASE}${VIEWS.AVAILABLE_VIEWS}`
                );
                return `${VIEWS.BASE}${VIEWS.AVAILABLE_VIEWS}`;
            },
            transformResponse: (r: TViewsResponse): TViewsResponse =>
                r.map((remoteView) => viewCheck(remoteView)),
            providesTags: ["Views"],
        }),
        getViewById: builder.query<TViewByIdResponse, TViewByIdRequest>({
            query: (req) => {
                const path = `${VIEWS.BASE}${VIEWS.VIEW_BY_ID(req.id)}`;
                Logger.debug("getViewById: querying", path);
                return path;
            },
            transformResponse: (r: TViewByIdResponse): TViewByIdResponse =>
                viewCheck(r),
        }),
        getViewByHash: builder.query<
            TViewByHashOrSlugResponse,
            TViewByHashOrSlugRequest
        >({
            query: (req) => {
                const params = queryString.stringify(req);
                const path = `${VIEWS.BASE}${VIEWS.RESOLVE}?${params}`;
                Logger.debug("getViewByHash: querying", path);
                return path;
            },
            transformResponse: (
                r: TViewByHashOrSlugResponse
            ): TViewByHashOrSlugResponse => viewCheck(r),
        }),
        saveViewAs: builder.mutation<TSaveViewAsResponse, TSaveViewAsRequest>({
            query: (req) => ({
                url: `${VIEWS.BASE}${VIEWS.AVAILABLE_VIEWS}`,
                method: "POST",
                body: req,
            }),
            invalidatesTags: ["Views"],
        }),
        saveView: builder.mutation<TSaveViewResponse, TSaveViewRequest>({
            query: (req) => ({
                url: `${VIEWS.BASE}${VIEWS.VIEW_BY_ID(req.id)}`,
                method: "PUT",
                body: req.body,
            }),
            invalidatesTags: ["Views"],
        }),
        deleteView: builder.mutation<TDeleteViewResponse, TDeleteViewRequest>({
            query: (req) => ({
                url: `${VIEWS.BASE}${VIEWS.VIEW_BY_ID(req.id)}`,
                method: "DELETE",
                body: {},
            }),
            invalidatesTags: ["Views"],
        }),
        getWidgets: builder.query<TWidgetsResponse, TWidgetsRequest>({
            query: () => {
                const path = `${VIEWS.BASE}${VIEWS.WIDGETS}`;
                Logger.debug("getWidgets: querying", path);
                return path;
            },
        }),
        getWidgetsCategory: builder.query<
            TWidgetsCategoryResponse,
            TWidgetsCategoryRequest
        >({
            query: (req) => {
                const params = req ? queryString.stringify(req) : "";
                const path = `${VIEWS.BASE}${String(
                    VIEWS.WIDGET_CATEGORIES
                )}?${params}`;
                Logger.debug("getWidgetsCategory: querying", path);
                return path;
            },
        }),
        getWidgetById: builder.query<TWidgetByIdResponse, TWidgetByIdRequest>({
            query: (req) => {
                const path = `${VIEWS.BASE}${VIEWS.WIDGET_BY_ID(req.id)}`;
                Logger.debug("getWidgetById: querying", path);
                return path;
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetViewsQuery,
    useGetWidgetsQuery,
    useGetWidgetByIdQuery,
    useSaveViewMutation,
    useSaveViewAsMutation,
    useDeleteViewMutation,
    useGetViewByHashQuery,
    useGetWidgetsCategoryQuery,
} = tagsApi;
