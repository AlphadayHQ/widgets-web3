import { FC, useState, useMemo, useEffect } from "react";
import { themes } from "../../styles";
import { Text, ApexDonutChart, ListGroup } from "../../components/common";
import Skeleton from "react-loading-skeleton";
import CONFIG from "../../config";
import { useAppSelector } from "../../api/store/hooks";
import { TZapperAsset } from "../../api/services";
import { getAssetPrefix } from "../../api/utils/portfolioUtils";
import { formatNumber, ENumberStyle } from "../../api/utils/format";
import { makeRepeated } from "../../api/utils/itemUtils";
import globalMessages from "../../globalMessages";
import { ReactComponent as ShowSVG } from "src/assets/alphadayAssets/icons/shown.svg";
import { TPortfolioDataForAddress } from "./types";
import { ITEM_COLORS } from "../colors";

import {
  StyledCoinText,
  StyledChart,
  StyledText,
  StyledH3,
  StyledDiv,
  StyledDivText,
  StyledDivSpan,
  StyledListHeader,
  StyledListItem,
  StyledListColumn,
  StyledOverview,
  StyledChartWrap,
  StyledStatsWrap,
  StyledMessage,
} from "./style";

const { TOKEN_METADATA_URL } = CONFIG.EXPLORERS;
const { DONUT_TOKENS_COUNT, SMALL_PRICE_CUTOFF } = CONFIG.WIDGETS.PORTFOLIO;

interface IPortfolioStats {
  showAll: boolean;
  showAllAssets: boolean;
  showBalance: boolean;
  balancesQueryFailed: boolean;
  portfolioData: TPortfolioDataForAddress | undefined;
  toggleBalance: () => void;
  ethPrice?: number | undefined;
}

const PortfolioStats: FC<IPortfolioStats> = ({
  showAll,
  showAllAssets,
  showBalance,
  portfolioData,
  ethPrice,
  balancesQueryFailed,
  toggleBalance,
}) => {
  const { theme: themeName } = useAppSelector((state) => state.ui);
  const theme = themes[themeName];

  // TODO: implement as a hook instead
  const breakpoint = 427;
  const breakpoint2 = 500;
  const initialWidth = document.getElementById(
    "portfolio-container"
  )?.clientWidth;

  const [width, setWidth] = useState<number | undefined>(initialWidth);

  const handleBalanceFigures = (val: string, show: boolean): string => {
    if (show) return val;
    return val
      .split("")
      .map(() => "*")
      .join("");
  };

  const assets = useMemo<TPortfolioDataForAddress["assets"]>(() => {
    const duplicateAssets: TZapperAsset[] = [];
    const portfolioAssets = portfolioData
      ? [...portfolioData.assets] // spreading the assets prevents mutation
          // remove duplicates(filtered by address) and compute their structure-equivalent balanceUSD, & balance
          .filter((asset, _index, array) => {
            const duplicates: TZapperAsset[] = array.filter(
              (a) => a.address === asset.address && a.network === asset.network
            );
            if (
              duplicates.length > 1 &&
              duplicateAssets.filter((a) => a.address === duplicates[0].address)
                .length === 0
            )
              duplicateAssets.push({
                ...duplicates[0],
                context: {
                  ...duplicates[0].context,
                  balance: duplicates.reduce(
                    (balance, a) => Number(balance) + Number(a.context.balance),
                    0
                  ),
                },
                balanceUSD: duplicates.reduce(
                  (balanceUSD, a) => Number(balanceUSD) + Number(a.balanceUSD),
                  0
                ),
              });

            return duplicates.length === 1;
          })
      : [];
    return [...duplicateAssets, ...portfolioAssets].sort(
      (a, b) => b.balanceUSD - a.balanceUSD
    );
  }, [portfolioData]);

  const totalValue = portfolioData?.totalValue || 0;

  const labels: string[] = [];
  const series = assets.map((item) => {
    labels.push(item.context.symbol);
    return Number(item.balanceUSD);
  });
  const othersBalance =
    series.length > DONUT_TOKENS_COUNT
      ? series.splice(DONUT_TOKENS_COUNT).reduce((n, p) => n + p)
      : 0;
  const donutData = {
    options: {
      chart: {
        id: "portfolio-donut",
        sparkline: {
          enabled: false,
        },
        background: "transparent",
        redrawOnWindowResize: true,
        height: "500px",
      },
      labels: [
        ...labels.slice(0, DONUT_TOKENS_COUNT),
        ...(othersBalance ? ["Others"] : []),
      ],
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter(value: number) {
            return `$${new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
            }).format(value)}`;
          },
        },
      },
      plotOptions: {
        pie: {
          donut: {
            customScale: 1,
            size: 140,
            background: "transparent",
          },
        },
      },
      stroke: {
        colors: undefined,
      },
      legend: {
        show: true,
        fontSize: "11px",
        position: "left",
        offsetX: 0,
        offsetY: 0,
        height: 500,
        labels: {
          colors: [theme.colors.primaryVariant100],
          useSeriesColors: false,
        },
        markers: {
          radius: 3,
        },
        onItemHover() {},
        formatter(
          label: string,
          opts: {
            w: {
              globals: {
                series: number[];
              };
            };
            seriesIndex: number;
          }
        ) {
          const percent =
            (100 * opts.w.globals.series[opts.seriesIndex]) /
            opts.w.globals.series.reduce((a, b) => a + b);
          return `
                        <span style="display: inline-flex; justify-content: space-between; width: 70%">
                            <div>${label}</div>
                            <div>&nbsp;${percent.toFixed(0)}%</div>
                        </span>`;
        },
      },
      colors: makeRepeated(ITEM_COLORS, assets.length),
    },
    series: [
      ...series.slice(0, DONUT_TOKENS_COUNT),
      ...(othersBalance ? [othersBalance] : []),
    ],
  };

  // TODO: maybe use a custom hook here?
  useEffect(() => {
    const ele = document.getElementById("portfolio-container");
    let timeOut: ReturnType<typeof setTimeout> | undefined;
    function handleResize() {
      // debounce for 150ms for performance
      if (timeOut) clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        if (ele?.clientWidth) setWidth(ele?.clientWidth);
      }, 150);
    }
    const resizeObserver = new ResizeObserver(handleResize);
    if (ele) resizeObserver.observe(ele);
    return () => {
      if (ele) resizeObserver?.unobserve(ele);
      if (timeOut) clearTimeout(timeOut);
    };
  }, []);

  return (
    <StyledStatsWrap>
      {balancesQueryFailed ? (
        <StyledMessage>
          {globalMessages.error.requestFailed("your balances")}
        </StyledMessage>
      ) : (
        <>
          <div>
            <StyledChartWrap>
              <StyledOverview>
                <StyledText mb="5px">
                  Total Balance{" "}
                  <ShowSVG onClick={toggleBalance} className="hide-balance" />
                </StyledText>
                <StyledH3>
                  {ethPrice === undefined || portfolioData === undefined ? (
                    <Skeleton width="80px" />
                  ) : (
                    handleBalanceFigures(
                      formatNumber({
                        value: totalValue,
                        style: ENumberStyle.Currency,
                        currency: "USD",
                      }).value,
                      showBalance
                    )
                  )}
                </StyledH3>
                <StyledDiv>
                  <StyledDivText noRates={ethPrice === undefined} one>
                    {ethPrice === undefined || portfolioData === undefined ? (
                      <Skeleton width="80px" />
                    ) : (
                      handleBalanceFigures(
                        formatNumber({
                          value: totalValue / ethPrice,
                          style: ENumberStyle.Decimal,
                        }).value,
                        showBalance
                      )
                    )}{" "}
                    {showBalance && portfolioData !== undefined && (
                      <StyledDivSpan>
                        <small>ETH</small>
                      </StyledDivSpan>
                    )}
                  </StyledDivText>
                </StyledDiv>
              </StyledOverview>
              <StyledChart
                containerWidth={width}
                breakpoint={breakpoint}
                breakpoint2={breakpoint2}
              >
                {donutData.series && (
                  <ApexDonutChart
                    options={donutData?.options}
                    series={donutData?.series}
                    width="290px"
                    height="400px"
                  />
                )}
              </StyledChart>
            </StyledChartWrap>

            {donutData.series?.length ? (
              <StyledListHeader>
                <StyledListColumn weight={2} alignLeft>
                  <StyledText mb="0">Asset</StyledText>
                </StyledListColumn>
                <StyledListColumn weight={1}>
                  <StyledText mb="0">Balance</StyledText>
                </StyledListColumn>
                <StyledListColumn weight={1} className="numeric">
                  <StyledText mb="0">Price</StyledText>
                </StyledListColumn>
                <StyledListColumn weight={1}>
                  <StyledText mb="0">Value</StyledText>
                </StyledListColumn>
              </StyledListHeader>
            ) : (
              <></>
            )}
          </div>
          <ListGroup>
            {assets.slice(0, !showAll ? 3 : undefined).map((asset) => {
              return (
                <StyledListItem
                  key={`${showAllAssets ? "all" : "single"}-${String(
                    asset.address
                  )}-${String(asset.network)}`}
                >
                  <StyledListColumn weight={2} alignLeft>
                    <StyledCoinText
                      target="_blank"
                      href={TOKEN_METADATA_URL(asset)}
                    >
                      <span className="firstCol">
                        {asset.displayProps?.images[0] !== undefined && (
                          <img
                            alt=""
                            src={asset.displayProps?.images[0]}
                            className="assetImg"
                          />
                        )}
                        {asset.context.symbol}
                        <span className="secondCol">
                          {getAssetPrefix(asset)}
                        </span>
                      </span>
                    </StyledCoinText>
                  </StyledListColumn>
                  <StyledListColumn weight={1}>
                    <Text as="span">
                      {handleBalanceFigures(
                        formatNumber({
                          value: asset.context.balance,
                        }).value,
                        showBalance
                      )}
                    </Text>
                  </StyledListColumn>
                  <StyledListColumn weight={1}>
                    <Text as="span">
                      {handleBalanceFigures(
                        formatNumber({
                          value: asset.context.price || 0,
                          style: ENumberStyle.Currency,
                          currency: "USD",
                          useEllipsis: true,
                          ellipsisCutoff: SMALL_PRICE_CUTOFF,
                        }).value,
                        showBalance
                      )}
                    </Text>
                  </StyledListColumn>
                  <StyledListColumn weight={1}>
                    <Text as="span">
                      {handleBalanceFigures(
                        formatNumber({
                          value: asset.balanceUSD || 0,
                          style: ENumberStyle.Currency,
                          currency: "USD",
                        }).value,
                        showBalance
                      )}
                    </Text>
                  </StyledListColumn>
                </StyledListItem>
              );
            })}
          </ListGroup>
        </>
      )}
    </StyledStatsWrap>
  );
};

export default PortfolioStats;
