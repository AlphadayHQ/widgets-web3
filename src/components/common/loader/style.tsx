import styled from "../../../styles";
import CONFIG from "../../../config/";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

export const StyledLoader = styled.div<{
    $height: string;
    collapse: boolean;
}>`
    width: 100%;
    height: 100%;
    height: ${({ $height }) => $height};
    display: ${({ collapse }) => (collapse ? "none" : "flex")};
    justify-content: center;
    align-items: center;
    z-index: ${Z_INDEX_REGISTRY.MODULE_LOADER};
`;
