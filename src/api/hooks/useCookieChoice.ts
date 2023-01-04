import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../api/store/hooks";
import { useGetIpMetadataQuery } from "../../api/services";
import { setCookieChoice } from "../../api/store";
import { ECookieChoice } from "../../api/types";

interface ICookieChoice {
    allowTracking: boolean;
}

export const useCookieChoice: () => ICookieChoice = () => {
    const dispatch = useAppDispatch();
    const cookieChoice = useAppSelector((state) => state.ui.cookieChoice);
    const { data: ipMeta } = useGetIpMetadataQuery(undefined, {
        skip:
            cookieChoice !== undefined &&
            cookieChoice > ECookieChoice.RejectAll,
    });

    useEffect(() => {
        if (ipMeta && !ipMeta.in_eu && cookieChoice === undefined) {
            dispatch(setCookieChoice(ECookieChoice.AcceptAll));
        }
    }, [ipMeta, cookieChoice, dispatch]);

    if (cookieChoice === ECookieChoice.AcceptAll) {
        return {
            allowTracking: true,
        };
    }

    const allowTracking = ipMeta !== undefined && !ipMeta.in_eu;

    return {
        allowTracking,
    };
};
