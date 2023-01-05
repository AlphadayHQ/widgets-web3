import styled from "../../../styles";
// import { TDatePos } from "src/api/utils/calendarUtils"; // TODO define TDatePos
import CONFIG from "../../../config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

// TODO define TDatePos
// export const StyledWrapper = styled.div<{
//     $position: TDatePos;
// }>`
//     position: absolute;
//     top: ${({ $position }) => $position.top}px;
//     left: ${({ $position }) => "left" in $position && $position.left}px;
//     right: ${({ $position }) => "right" in $position && $position.right}px;
// `;

interface IProps {
  disabled?: boolean;
  $show?: boolean;
  $width: string;
}

export const StyledCalTooltip = styled.div<{
  $width: string;
  $isFullsize: boolean;
}>`
  .tooltip {
    position: relative;
    display: inline-block;
    z-index: ${({ $isFullsize }) =>
      $isFullsize
        ? Z_INDEX_REGISTRY.CALENDAR_EVENTS_TOOLTIP_FULLSIZE
        : Z_INDEX_REGISTRY.CALENDAR_EVENTS_TOOLTIP};
  }

  .tooltip .tooltip-wrapper {
    background-color: ${({ theme }) => theme.colors?.primaryVariant200};
    color: ${({ theme }) => theme.colors?.text};
    display: flex;
    width: ${({ $width }) => $width || "max-content"};
    align-items: center;
    justify-content: center;
    text-align: left;
    border-radius: 6px;
    padding: 16px 0 16px 16px;
    position: absolute;
    z-index: ${Z_INDEX_REGISTRY.TOOLTIP_WRAPPER};
    top: 120%;
    left: -50%;
    margin-left: -60px;
    cursor: auto;

    .close {
      margin: 12px 4px 8px 12px;
      cursor: pointer;
    }

    svg {
      fill: ${({ theme }) => theme.colors?.primaryVariant700};
      cursor: pointer;
    }
  }
  .tooltip .calendar-wrap {
    padding-left: 12px;
    justify-content: start;
    background: ${({ theme }) => theme.colors.backgroundVariant1100};
    border: 1px solid ${({ theme }) => theme.colors.btnRingVariant500};
    box-shadow: 0px 0px 35px 9px rgba(19, 21, 27, 0.7);
    border-radius: 5px;
  }
  .tooltip-text {
    color: ${({ theme }) => theme.colors?.text};
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.2px;
    align-self: center;
    margin: 0;
  }

  .tooltip::after .tooltip-wrapper {
    visibility: visible;
  }

  .events {
    display: flex;

    .date {
      width: 47px;
      /* margin-left: -4px; */
      margin-right: 16px;
      display: flex;
      flex-direction: column;
    }
    .date-text {
      font-style: normal;
      font-weight: 400;
      font-size: 10px;
      line-height: 21px;
      /* identical to box height, or 210% */

      margin: 2px;
      margin-top: 0px;
      text-align: center;
      letter-spacing: 0.5px;
      text-transform: uppercase;

      /* Primary/Dark Grey */

      color: ${({ theme }) => theme.colors?.primaryVariant100};
    }

    .date-number {
      font-family: "Open Sans";
      font-style: normal;
      font-weight: 600;
      font-size: 30px;
      line-height: 24px;
      /* identical to box height, or 80% */

      text-align: center;
      letter-spacing: -0.5px;

      /* Primary/Light */

      color: ${({ theme }) => theme.colors?.primary};
    }

    .list {
      margin-top: 1.5px;
      mix-blend-mode: lighten;
      max-height: 300px;
    }

    .list > div {
      padding-right: 10px;
    }

    .eventItem {
      display: flex;
      margin-bottom: 0;
      font-weight: 400;
      font-size: 11px;
      line-height: 14px;
      flex-wrap: wrap;
      margin-bottom: 4px;
      color: ${({ theme }) => theme.colors?.primaryVariant100};
    }
    .event-category {
      color: ${({ theme }) => theme.colors?.secondaryOrange};
      align-self: center;
    }

    .event-title {
      font-weight: 600;
      font-size: 12px;
      line-height: 16px;
      /* or 133% */

      letter-spacing: 0.2px;

      /* Primary/Light */

      color: ${({ theme }) => theme.colors?.primary};

      /* Inside auto layout */

      flex: none;
      margin: 1px;
    }
  }
  .dot {
    width: 7px;
    height: 7px;
    align-self: center;
    display: block;
    border-radius: 100px;
    margin: 0px;
    margin-right: 5px;
    flex: none;
    order: 0;
    flex-grow: 0;
  }
  .separator {
    position: static;
    width: 5px;
    height: 14px;

    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 14px;
    /* identical to box height, or 127% */

    letter-spacing: 0.5px;

    /* Primary/Dark Grey */
    color: ${({ theme }) => theme.colors?.primaryVariant100};
    margin: 0px 7px;
    align-self: center;
  }
  .dates {
    white-space: nowrap;
    align-self: center;
  }
  .hr {
    background: ${({ theme }) => theme.colors.btnRingVariant500};
    margin: 10px 0;
  }
  .pointer {
    cursor: pointer;
  }
`;

export const StyledTooltip = styled.button<IProps>`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  outline: inherit;
  height: max-content;
  width: max-content;

  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltip-wrapper {
    visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
    background-color: ${({ theme }) => theme.colors?.primaryVariant200};
    color: ${({ theme }) => theme.colors?.text};
    display: flex;
    width: ${({ $width }) => $width || "max-content"};
    align-items: center;
    justify-content: center;
    text-align: left;
    border-radius: 6px;
    padding: 16px;
    position: absolute;
    z-index: ${Z_INDEX_REGISTRY.TOOLTIP_WRAPPER};
    top: 120%;
    left: -50%;
    margin-left: -60px;
    cursor: auto;

    .close {
      width: 20px;
      margin: 12px 4px 8px 12px;
      cursor: pointer;
    }

    svg {
      cursor: pointer;
    }

    svg.cross {
      fill: ${({ theme }) => theme.colors?.primaryVariant700};
    }
    .arrow {
      background-color: ${({ theme }) => theme.colors?.primaryVariant200};
    }
  }
  .tooltip .calendar-wrap {
    padding-left: 12px;
    justify-content: start;
    background: ${({ theme }) => theme.colors.backgroundVariant1100};
    border: 1px solid ${({ theme }) => theme.colors.btnRingVariant500};
    box-shadow: 0px 0px 35px 9px rgba(19, 21, 27, 0.7);
    border-radius: 5px;
  }
  .tooltip-text {
    color: ${({ theme }) => theme.colors?.text};
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.2px;
    align-self: center;
    margin: 0;
  }

  .tooltip .tooltip-wrapper::after {
    content: "";
    position: absolute;
    bottom: 100%;
    right: 50%;
    margin-right: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent
      ${({ theme }) => theme.colors?.primaryVariant200} transparent;
  }

  .tooltip::after .tooltip-wrapper {
    visibility: visible;
  }
`;

export const StyledDot = styled.span`
  width: 7px;
  height: 7px;
  align-self: center;
  background-color: ${({ color, theme }) => color || theme.colors?.primary};
  display: block;
  border-radius: 100px;
  margin: 0px;
  margin-right: 5px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const StyledSeparator = styled.span`
  position: static;
  width: 5px;
  height: 14px;

  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 14px;
  /* identical to box height, or 127% */

  letter-spacing: 0.5px;

  /* Primary/Dark Grey */
  color: ${({ theme }) => theme.colors?.primaryVariant100};
  margin: 0px 7px;
  align-self: center;
`;

export const StyledEvents = styled.div`
  display: flex;

  .date {
    width: 47px;
    /* margin-left: -4px; */
    margin-right: 16px;
    display: flex;
    flex-direction: column;
  }
  .date-text {
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 21px;
    /* identical to box height, or 210% */

    margin: 2px;
    text-align: center;
    letter-spacing: 0.5px;
    text-transform: uppercase;

    /* Primary/Dark Grey */

    color: ${({ theme }) => theme.colors?.primaryVariant100};
  }

  .date-number {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 24px;
    /* identical to box height, or 80% */

    text-align: center;
    letter-spacing: -0.5px;

    /* Primary/Light */

    color: ${({ theme }) => theme.colors?.primary};
  }

  .eventItem {
    display: flex;
    margin-bottom: 0;
  }
  .event-category {
    color: ${({ theme }) => theme.colors?.secondaryOrange};
    align-self: center;
  }

  .event-title {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    /* or 133% */

    letter-spacing: 0.2px;

    /* Primary/Light */

    color: ${({ theme }) => theme.colors?.primary};

    /* Inside auto layout */

    flex: none;
    margin: 1px;
  }
`;

export const StyledHr = styled.hr<{ hide: boolean }>`
  background: ${({ theme }) => theme.colors.btnRingVariant500};
  margin: 10px 0;
  display: ${({ hide }) => (hide ? "none" : "block")};
`;
