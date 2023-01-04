import moment from "moment";
import { TCachedView } from "../../api/types";
import { TRemoteUserView } from "../../api/services";

export const isViewModified = (view: TCachedView): boolean => {
    if (view.lastModified === undefined) return false;
    const lastModified = moment(view.lastModified);
    const lastSaved = moment(view.data.updated_at);
    return lastModified.isAfter(lastSaved);
};

export const remoteViewAsCachedView: (
    remoteView: TRemoteUserView
) => TCachedView = (remoteView) => ({
    lastModified: undefined,
    lastSynced: new Date().toISOString(),
    data: {
        ...remoteView,
        keywords: remoteView.keywords.map((kw) => ({
            ...kw,
            tag: {
                ...kw.tag,
                tagType: kw.tag.tag_type,
            },
        })),
    },
});
