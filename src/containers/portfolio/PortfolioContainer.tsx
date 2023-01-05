import { FC, useEffect, useMemo, useState } from "react";
import { IWidgetContainer } from "../../types/widgetContainer";
import {
    useGetTokensBalanceForAddressesQuery,
    TTokensBalanceForAddress,
    computeAssetTotal,
    useResolveEnsQuery,
    useGetNftBalanceForAddressesQuery,
    TNftBalanceForAddress,
    computeNftAssetTotal,
    useGetMarketDataQuery,
} from "../../api/services";
import { WalletConnectionState } from "../../api/types";
import { useWallet, useView, useWidgetLib } from "../../api/hooks";
import {
    mapAccountsToAddressArray,
    validateENSAddr,
    mapAccountToTabAccount,
} from "../../api/utils/accountUtils";
import PortfolioWidget from "../../widgets/portfolio/PortfolioWidget";
import BaseWidget from "../../widgets/baseWidget/BaseWidget";
import { useAppDispatch, useAppSelector } from "../../api/store/hooks";
import {
    toggleShowBalance as toggleShowBalanceInStore,
    toggleShowAllAssets as toggleShowAllAssetsInStore,
    selectShowAllAssets,
} from "../../api/store";
import CONFIG from "../../config";
import { EToastRole, toast } from "../../api/utils/toastUtils";
import { EPortfolioType } from "../../widgets/portfolio/types";

const { WIDGET_HEIGHT } = CONFIG.WIDGETS.PORTFOLIO;

const PortfolioContainer: FC<IWidgetContainer> = ({ moduleData, uiProps }) => {
    const dispatch = useAppDispatch();

    const {
        connectWallet,
        verifyWallet,
        authWallet,
        portfolioAccounts,
        addPortfolioAccount,
        selectedPortfolioAccount,
        setSelectedPortfolioAccount,
        removePortfolioAccount,
    } = useWallet();
    const { showWidgetLib } = useWidgetLib();
    const { removeWidgetFromCache } = useView();
    const [balancesQueryFailed, setBalancesQueryFailed] = useState(false);
    const [enteredEnsAddress, setEnteredEnsAddress] = useState<string>("");

    const [portfolioType, setPortfolioType] = useState<EPortfolioType>(
        EPortfolioType.Ft
    );
    const [widgetHeight, setWidgetHeight] = useState<number>(WIDGET_HEIGHT);

    const switchPortfolioType = () =>
        setPortfolioType((prev) =>
            prev === EPortfolioType.Ft ? EPortfolioType.Nft : EPortfolioType.Ft
        );

    const selectedAddress = selectedPortfolioAccount?.address ?? null;

    const accounts = mapAccountToTabAccount(
        portfolioAccounts,
        authWallet.account
    );

    const { showBalance } = useAppSelector((state) => state.ui);
    const toggleBalance = () => {
        dispatch(toggleShowBalanceInStore());
    };

    const showAllAssets = useAppSelector(selectShowAllAssets(moduleData.hash));
    const toggleShowAllAssets = () => {
        dispatch(toggleShowAllAssetsInStore({ widgetHash: moduleData.hash }));
    };

    const {
        currentData: ensAddressData,
        isError: isErrorUseResolveEnsQuery,
    } = useResolveEnsQuery(
        { ens: enteredEnsAddress },
        { skip: enteredEnsAddress === "" }
    );

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.PORTFOLIO.POLLING_INTERVAL) * 1000;

    const {
        data: tokensBalanceForAddresses,
        isLoading: isLoadingTokensBalanceForAddresses,
        isError: isErrorTokensBalanceForAddresses,
    } = useGetTokensBalanceForAddressesQuery(
        {
            addresses: mapAccountsToAddressArray(portfolioAccounts),
        },
        {
            skip: selectedAddress === null,
            pollingInterval,
        }
    );

    const {
        data: nftBalanceForAddresses,
        isLoading: isLoadingNftBalanceForAddresses,
        isError: isErrorNftBalanceForAddresses,
    } = useGetNftBalanceForAddressesQuery(
        {
            addresses: mapAccountsToAddressArray(
                showAllAssets || selectedPortfolioAccount === null
                    ? portfolioAccounts
                    : [selectedPortfolioAccount]
            ),
        },
        {
            skip: selectedAddress === null,
        }
    );

    const {
        data: ethPriceResponse,
        isLoading: isLoadingEthPrice,
    } = useGetMarketDataQuery(
        {
            tags: "ethereum",
            limit: 1,
        },
        {
            pollingInterval,
        }
    );

    const isConnectingWallet =
        authWallet.status === WalletConnectionState.Connecting;

    const showVerify = authWallet.status === WalletConnectionState.Connected;

    const portfolioDataForAddress =
        (tokensBalanceForAddresses &&
            selectedAddress &&
            tokensBalanceForAddresses[selectedAddress]) ||
        undefined;

    const portfolioDataForAddresses = useMemo(() => {
        const balances: TTokensBalanceForAddress = {
            assets: [],
            totalValue: 0,
        };

        if (tokensBalanceForAddresses)
            Object.keys(tokensBalanceForAddresses).forEach((addr) => {
                balances.assets = [
                    ...balances.assets,
                    ...tokensBalanceForAddresses[addr].assets,
                ];
            });

        balances.totalValue = computeAssetTotal(balances.assets);
        return balances;
    }, [tokensBalanceForAddresses]);

    const portfolioNftDataForAddresses = useMemo(() => {
        const balances: TNftBalanceForAddress = {
            items: [],
            totalValue: 0,
        };

        if (nftBalanceForAddresses)
            balances.items = [
                ...balances.items,
                ...nftBalanceForAddresses.items,
            ];

        balances.totalValue = computeNftAssetTotal(balances.items);
        return balances;
    }, [nftBalanceForAddresses]);

    useEffect(() => {
        /**
         * This condition will only pass while: tokensBalance.assets is undefined,
         * there is a selcted address, and nothing is loading and
         *
         * timeout is reset on rerender
         * */
        let timeout: number | undefined;

        if (
            (selectedAddress &&
                !tokensBalanceForAddresses?.[selectedAddress]) ||
            isErrorTokensBalanceForAddresses
        ) {
            // tokensBalanceForAddresses is undefined at first
            timeout = window.setTimeout(
                () => setBalancesQueryFailed(true),
                3000
            );
        }
        if (selectedAddress && tokensBalanceForAddresses?.[selectedAddress]) {
            clearTimeout(timeout);
            if (balancesQueryFailed) setBalancesQueryFailed(false);
        }

        return () => {
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isConnectingWallet,
        isLoadingTokensBalanceForAddresses,
        isLoadingEthPrice,
        selectedAddress,
        tokensBalanceForAddresses,
    ]);

    useEffect(() => {
        if (isErrorUseResolveEnsQuery) {
            toast(
                "Sorry, we were not able to resolve your ENS address. Please try again later",
                { type: EToastRole.Error }
            );
            setEnteredEnsAddress("");
        }
        if (ensAddressData) {
            addPortfolioAccount({
                address: ensAddressData.address,
                ens: ensAddressData.ens,
            });
            setEnteredEnsAddress("");
        }
    }, [addPortfolioAccount, ensAddressData, isErrorUseResolveEnsQuery]);

    return (
      <BaseWidget
        id="portfolio-container"
        uiProps={uiProps}
        moduleData={moduleData}
        showTrashIcon={showWidgetLib}
        onRemoveWidget={removeWidgetFromCache}
        onAdjustWidgetHeight={setWidgetHeight}
        adjustable={portfolioType === EPortfolioType.Nft}
      >
        <PortfolioWidget
          isLoading={
            isConnectingWallet ||
            isLoadingTokensBalanceForAddresses ||
            isLoadingNftBalanceForAddresses || // TODO: seperate nft isLoading state
            isLoadingEthPrice
          } // At first, isLoading is true & portfolioDataForAddress is undefined
          accounts={accounts}
          authAccount={authWallet.account}
          selectedAddress={selectedAddress}
          onConnectWallet={connectWallet}
          showVerify={showVerify}
          onVerifyWallet={verifyWallet}
          onAddAddress={(address: string) => {
            if (validateENSAddr(address)) {
              setEnteredEnsAddress(address);
            } else {
              addPortfolioAccount({ address });
            }
          }}
          onRemoveAddress={(address: string) =>
            removePortfolioAccount({ address })
          }
          onSelectAddress={(address: string) =>
            setSelectedPortfolioAccount({ address })
          }
          portfolioDataForAddresses={portfolioDataForAddresses}
          portfolioDataForAddress={portfolioDataForAddress}
          nftBalanceForAddresses={portfolioNftDataForAddresses}
          ethPrice={ethPriceResponse?.results[0]?.price}
          balancesQueryFailed={balancesQueryFailed}
          nftsQueryFailed={isErrorNftBalanceForAddresses}
          toggleBalance={toggleBalance}
          showBalance={showBalance}
          toggleShowAllAssets={toggleShowAllAssets}
          showAllAssets={showAllAssets}
          widgetHeight={widgetHeight}
          portfolioType={portfolioType}
          switchPortfolioType={switchPortfolioType}
        />
      </BaseWidget>
    );
};

export default PortfolioContainer;
