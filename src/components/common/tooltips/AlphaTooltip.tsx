/* eslint-disable react/button-has-type */
import { themes } from "../../../styles";
import React, { FC, useState } from "react";
import { useLayer, Arrow } from "react-laag";
// import { useAppSelector } from "src/api/store/hooks"; //
import { parseNewLine } from "../../../utils/textUtils";
import { ReactComponent as Cross } from "../../../assets/icons/cross.svg";
import { StyledTooltip } from "./AlphaTooltip.style";
import CONFIG from "../../../config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

export interface TooltipProps {
  tooltipText: string;
  disabled?: boolean;
  label?: string;
  className?: string;
  onClick?: () => void | (() => Promise<void>);
  width: string;
  children?: React.ReactNode;
  hiddenCloseButton?: boolean;
}

export const AlphaTooltip: FC<TooltipProps> = ({
  width,
  children,
  tooltipText,
  hiddenCloseButton,
  ...restProps
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen: showTooltip,
    placement: "bottom-start",
    auto: true,
    possiblePlacements: ["bottom-start", "bottom-end", "bottom-center"],
    triggerOffset: 6,
    onOutsideClick: () => setShowTooltip(false),
  });

  const handleShow = () => {
    setShowTooltip((prev) => {
      return !prev;
    });
  };

  return (
    <StyledTooltip
      $width={width}
      $show={showTooltip}
      onClick={handleShow}
      {...restProps}
      {...triggerProps}
    >
      <div className="tooltip">
        {children}

        {showTooltip &&
          renderLayer(
            <div
              {...layerProps}
              style={{
                ...layerProps.style,
                width,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "left",
                padding: "16px",
                backgroundColor: themes["dark"].colors.primaryVariant200, // TODO replace hard-coded theme
                borderRadius: 5,
                zIndex: Z_INDEX_REGISTRY.TOOLTIP_LAYER,
              }}
              className="tooltip-wrapper"
            >
              {parseNewLine(tooltipText)}
              {!hiddenCloseButton && (
                <span
                  role="button"
                  aria-label="Close tooltip"
                  title="Close"
                  onClick={handleShow}
                  className="close"
                  style={{
                    width: 20,
                    margin: "12px 4px 8px 12px",
                    cursor: "pointer",
                  }}
                  tabIndex={0}
                >
                  <Cross className="cross" onClick={handleShow} />
                </span>
              )}
              <Arrow {...arrowProps} className="arrow" size={8} roundness={0} />
            </div>
          )}
      </div>
    </StyledTooltip>
  );
};

AlphaTooltip.defaultProps = {
  disabled: false,
  label: "tooltip",
};
