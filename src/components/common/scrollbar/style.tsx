import styled, { css } from "../../../styles";
import CONFIG from "../../../config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

export const StyledWrap = styled(({ ...props }) => (
    <div {...props} />
))`
    height: 100%;
    position: relative;
    ${({ bottom }) =>
        !!bottom &&
        css`
            height: calc(100% - ${bottom});
        `}
    .ps {
        overflow: hidden;
    }
    .ps > .ps__rail-y {
        width: 5px;
        background-color: rgba(72, 83, 114, 0.06);
        z-index: ${Z_INDEX_REGISTRY.SCROLLBAR};
        position: absolute;
        left: auto !important;
        right: 0;
        opacity: 0;
        margin: 1px;
        transition: opacity 0.2s;
    }
    @media (prefers-reduced-motion: reduce) {
        .ps > .ps__rail-y {
            transition: none;
        }
    }
    .ps > .ps__rail-y > .ps__thumb-y {
        position: absolute;
        border-radius: 0;
        width: 5px;
        left: 0;
        background-color: #97a3b9;
    }
    .ps .ps__rail-x:hover,
    .ps .ps__rail-y:hover,
    .ps .ps__rail-x:focus,
    .ps .ps__rail-y:focus,
    .ps .ps__rail-x.ps--clicking,
    .ps .ps__rail-y.ps--clicking {
        background-color: transparent;
    }
    .ps.ps--active-y:hover > .ps__rail-y,
    .ps.ps--active-y:focus > .ps__rail-y {
        opacity: 1;
    }

    .scrollbar-sm > .ps__rail-y {
        width: 1px;
    }
    .scrollbar-sm > .ps__rail-y > .ps__thumb-y {
        width: 1px;
    }

    .scrollbar-lg > .ps__rail-y {
        width: 6px;
    }
    .scrollbar-lg > .ps__rail-y > .ps__thumb-y {
        width: 6px;
    }
    .scrollbar-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: auto;
    }
`;
