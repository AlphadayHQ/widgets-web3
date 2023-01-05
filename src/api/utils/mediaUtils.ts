import querystring from "query-string";
import CONFIG from "../../config";

type TOnOrOff = 1 | 0;
type TEmbedOptions = {
    autoplay?: TOnOrOff;
    showinfo?: TOnOrOff;
    controls?: TOnOrOff;
    rel?: TOnOrOff;
    autohide?: TOnOrOff;
    loop?: TOnOrOff;
    modestbranding?: TOnOrOff;
    mute?: TOnOrOff;
};

const {
    WIDGETS: { MEDIA },
} = CONFIG;

export const entryEmbedUrl = (
    entryId: string,
    options: TEmbedOptions = {}
): string => {
    const params: string = querystring.stringify(options);
    return `${String(MEDIA.YOUTUBE_EMBED_BASE_URL)}${entryId}?${params}`;
};
