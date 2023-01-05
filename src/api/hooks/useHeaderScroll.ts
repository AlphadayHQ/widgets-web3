import { useCallback, useEffect, useState } from "react";
import useElementSize from "./useElementSize";

interface IHeaderScroll {
    width: number;
    squareRef: (node: HTMLDivElement | null) => void;
    channelsScroll: boolean;
    headerRef: HTMLDivElement | null;
    setHeaderRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
    handleClickScroll: (scrollRight?: boolean) => void;
    hideLeftPan: boolean;
    hideRightPan: boolean;
}

// TODO reuse this for MarketModule
const useHeaderScroll: () => IHeaderScroll = () => {
    const [squareRef, { width }] = useElementSize();

    const [headerRef, setHeaderRef] = useState<HTMLDivElement | null>(null);
    const [channelsScroll, setChannelsScroll] = useState(false);

    const handleChannelsScroll = () => {
        let timer;
        setChannelsScroll(true);
        clearTimeout(timer);
        timer = setTimeout(() => setChannelsScroll(false), 1500);
    };

    const handleClickScroll = useCallback(
        (scrollRight = false) => {
            const scrollValue = width > 400 ? 300 : 220;
            if (headerRef)
                headerRef.scrollBy({
                    left: scrollRight ? scrollValue : -scrollValue,
                    behavior: "smooth",
                });
        },
        [headerRef, width]
    );

    useEffect(() => {
        if (headerRef !== null) {
            // removeEventListener if it already exists
            headerRef?.removeEventListener("scroll", handleChannelsScroll);
            headerRef?.addEventListener("scroll", handleChannelsScroll);
        }
    }, [headerRef]);

    return {
        width,
        squareRef,
        channelsScroll,
        headerRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan: headerRef?.scrollLeft === 0,
        hideRightPan: headerRef
            ? headerRef?.scrollLeft + headerRef?.clientWidth >
              headerRef?.scrollWidth - 5
            : true,
    };
};

export default useHeaderScroll;
