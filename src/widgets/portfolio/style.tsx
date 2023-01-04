import styled, { device } from "../../styles";
import { ListGroupItem } from "../../components/common/list-group/list-group";
import CONFIG from "../../config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;
const ADDRESSES_TAB_HEIGHT = 53;
const ASSET_SWITCH_HEIGHT = 42;

export const StyledButtonsWrap = styled.div`
  display: flex;
  margin: 15px auto;
  justify-content: center;
  .wrap {
    display: flex;
    width: 315px;
    justify-content: space-between;
  }
`;

export const StyledMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  top: 220px;
  z-index: ${Z_INDEX_REGISTRY.PORTFOLIO_ERROR_MSG};
  height: 200px !important;
  color: ${({ theme }) => theme.colors.primaryVariant100};
`;

export const StyledCoinText = styled.a`
  text-transform: uppercase;
  font-weight: 500;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  .symbol {
    display: flex;
    flex-wrap: wrap;
  }

  .firstCol {
    display: flex;
    flex-wrap: wrap;
  }

  .secondCol {
    // margin-left: 4px;
    // text-transform: lowercase;
  }
`;

export const StyledSwitch = styled.div`
  margin: 0 10px 0;
  padding-top: 15px;
  height: ${ASSET_SWITCH_HEIGHT}px;
`;

export const StyledChart = styled.div<{
  containerWidth: number | undefined;
  breakpoint: number;
  breakpoint2: number;
}>`
  display: flex;
  justify-content: space-between;

  .apexcharts-canvas {
    height: 190px !important;

    svg {
      width: 320px;
      height: 200px !important;
      margin-left: -10px;
      foreignObject {
        height: 200px !important;
      }
    }
  }
  .apexcharts-legend {
    width: 120px !important;
    font-weight: 600;
    font-size: 12px;
    line-height: 17px;
    /* identical to box height, or 142% */

    letter-spacing: 0.2px;
  }
  .apexcharts-legend-marker {
    width: 9px !important;
    height: 9px !important;
  }
  .apexcharts-graphical {
    transform: ${({ containerWidth, breakpoint, breakpoint2 }) =>
      containerWidth &&
      containerWidth > breakpoint &&
      containerWidth < breakpoint2
        ? "translate(165px, 38px)"
        : "translate(195px, 38px)"} !important;
    width: 200px;
    height: 200px;
  }

  .apexcharts-pie g {
    transform: ${({ containerWidth, breakpoint, breakpoint2 }) =>
      containerWidth &&
      containerWidth > breakpoint &&
      containerWidth < breakpoint2
        ? "scale(1)"
        : "scale(0.9)"};
  }

  .apexcharts-legend-series {
    margin: 4px 5px !important;
  }
`;

export const StyledText = styled(({ ...rest }) => <p {...rest} />)`
  font-size: 11px;
  text-transform: capitalize;
  letter-spacing: 0.5px;
  font-weight: 500;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  /* identical to box height, or 150% */

  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.primaryVariant100};
`;

export const StyledH3 = styled.h3`
  font-size: 26px;
  letter-spacing: -1px;
  display: flex;
  font-family: "Open Sans";
  font-weight: 600;
  margin-bottom: 2px;
  color: ${({ theme }) => theme.colors.primary};
  small {
    font-weight: 300;
    color: ${({ theme }) => theme.colors.primaryVariant500};
    font-size: 16px;
    margin-left: 3px;
    place-self: end;
  }
`;

export const StyledDiv = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
`;

export const StyledOverview = styled.div`
  padding-top: 24px;
  align-self: flex-start;
  max-width: 130px;

  .hide-balance {
    cursor: pointer;
  }
`;

export const StyledDivText = styled.p<{ noRates?: boolean; one?: boolean }>`
  font-size: 14x;
  font-family: "Open Sans";
  margin-bottom: 0px;
  color: ${({ theme }) => theme.colors.success};
  &:last-of-type {
    margin-left: ${({ noRates, one }) => (noRates || one ? "0px" : "10px")};
  }
`;

export const StyledDivSpan = styled.span`
  font-weight: 500;
  font-size: 14px;
  margin-right: 5px;
  color: ${({ theme }) => theme.colors.primaryVariant500};
  small {
    font-size: 10px;
  }
`;

export const StyledListHeader = styled.div`
  margin-bottom: 10px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex: 1;
  p {
    text-align: end;
  }
`;

export const StyledAddresses = styled.div`
  display: flex;
  padding-top: 3px;
  margin: 0px 10px 0;

  .tab-item {
    margin: 0px 4px;
  }

  &:first-child {
    margin: 0px 4px 0px 6px;
  }
`;
export const StyledChartWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 17px;
`;
export const StyledStatsWrap = styled.div`
  padding: 5px 15px 15px;
`;

export const StyledNftsWrap = styled.div`
  padding: 0 0px 15px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  height: 100%;

  ${device.small} {
    padding: 0 15px 15px;
  }
`;

export const StyledNftsList = styled.div<{ $widgetHeight: number }>`
  padding-top: 20px;
  height: ${({ $widgetHeight }) =>
    $widgetHeight - ADDRESSES_TAB_HEIGHT - ASSET_SWITCH_HEIGHT || 600}px;
`;

export const StyledNftCard = styled.div<{ $isEstValue: boolean }>`
  display: flex;
  margin: 5px;

  .card {
    position: relative;
    width: 130px;
    height: 160px;
    margin: 0 auto;
    background: #000;
    border-radius: 10px;
    border-radius: 5px;

    .no-image {
      margin: 0;
      position: absolute;
      top: 50%;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      width: 100px;
      height: 100px;
      padding-bottom: 20%;
      color: ${({ theme }) => theme.colors.primary};
    }

    .face {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      transition: 0.5s;

      &.face1 {
        box-sizing: border-box;
        display: flex;
        overflow: hidden;

        .img {
          margin: 0;
          padding: 0;
          width: 100%;
          object-fit: cover;
          border-radius: 5px;
        }
      }

      &.face2 {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        transition: 0.5s;
        height: 40px;
        padding: 8px;
        border-radius: 3px 3px 5px 5px;
        background-color: ${(props) =>
          props.theme.colors.backgroundVariant1200};

        .title {
          display: flex;
          justify-content: space-between;
          width: 100%;
          .name {
            font-weight: 600;
            font-size: 14px;
            width: ${({ $isEstValue }) => ($isEstValue ? "85px" : "100%")};
            white-space: nowrap;
            overflow: hidden !important;
            text-overflow: ellipsis;
            align-self: flex-end;
          }
          .value {
            display: flex;
            flex-direction: column;
            align-items: end;

            span {
              line-height: 100%;
              font-size: 10px;
              white-space: nowrap;
            }
            p {
              font-weight: 600;
              font-size: 12px;
              white-space: nowrap;
            }
          }
        }
      }
    }

    &:hover {
      .face {
        transition: 0.3s;
        filter: brightness(1.1);

        &.face2 {
          height: 50px;
        }
      }
    }
  }

  ${device.small} {
    .card {
      width: 150px;
      height: 200px;

      .value {
        align-items: flex-end;

        span {
          display: inline-block;
        }
        p {
          white-space: wrap;
        }
      }
    }
  }
`;

export const StyledAddressesWrap = styled.div<{
  scroll: boolean;
}>`
  height: ${ADDRESSES_TAB_HEIGHT}px;
  overflow-y: hidden;
  overflow-x: scroll;
  scrollbar-width: none;
  scrollbar-width: none; /* Firefox */
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.btnRingVariant500};
  -ms-overflow-style: none; /* IE 10+ */
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: none !important;
    background-color: transparent;
  }
  ::-webkit-scrollbar {
    width: 3px !important;
    height: 3px;
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${({ scroll, theme }) =>
      scroll ? theme.colors.gray500 : "transparent"};
    visibility: ${({ scroll }) => (scroll ? "visible" : "hidden")};
    opacity: ${({ scroll }) => (scroll ? "1" : "0")};
    border-radius: 10px;
    transition: opacity 2s linear;
  }
`;

export const StyledListItem = styled(({ ...rest }) => (
  <ListGroupItem {...rest} />
))`
  display: flex;
  padding-left: 0px;
  padding-right: 0px;
  display: flex;
  border-left: 0;
  border-right: 0;
  justify-content: space-between;
  font-size: 13px;
  border-color: ${({ theme }) => theme.colors.btnRingVariant500};

  .assetImg {
    width: 20px;
    height: 20px;
    border-radius: 20px;
    margin-right: 10px;
  }
`;

export const StyledListColumn = styled.div<{
  alignLeft?: boolean;
  weight: number;
}>`
  display: flex;
  flex: ${({ weight }) => weight};
  justify-content: ${({ alignLeft }) => (alignLeft ? "start" : "flex-end")};
`;

StyledListItem.displayName = "ListGroupItem";
