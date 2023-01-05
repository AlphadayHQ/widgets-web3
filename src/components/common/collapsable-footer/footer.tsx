import React, { FC } from "react";
import { ReactComponent as ChevronsDownSVG } from "../../assets/icons/chevron-down.svg";
import { StyledBottom, StyledWrap } from "./style";

interface IFooter {
    showAll: boolean;
    handleShowAll: (data: boolean) => void;
}

const CollapseFooter: FC<IFooter> = ({ showAll, handleShowAll }) => {
    return (
      <StyledWrap
        role="button"
        tabIndex={0}
        onClick={() => handleShowAll(!showAll)}
        style={{ cursor: "pointer" }}
      >
        <StyledBottom showAll={showAll}>
           <ChevronsDownSVG />
        </StyledBottom>
      </StyledWrap>
    );
};

export default CollapseFooter;
