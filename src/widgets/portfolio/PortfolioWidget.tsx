import { FC, useEffect, useState } from "react";
import { CardBody } from "../../components/common/card/card";
import { validateHexOrEnsAddr } from "../../api/utils/accountUtils";
import { TCryptoAccount } from "../../api/types";
import {
  TPortfolioDataForAddress,
  TPortfolioNFTDataForAddress,
  TPortfolioTabAccount,
  EPortfolioType,
} from "./types";
import AddressInput from "./AddressInput";
import CollapseFooter from "../../components/common/collapsable-footer/footer";
import PortfolioStats from "./PortfolioStats";
import { StyledButtonsWrap } from "./style";
import { AlphaButton } from "../../components/common/buttons/AlphaButton";
import ModuleLoader from "../../components/common/loader/AlphaLoader";
import AddressTabSelect from "./AddressTabSelect";
import AssetSwitch from "./AssetSwitch";
import NftList from "./nfts/NftList";

interface IPortfolio {
  isLoading: boolean;
  accounts: Array<TPortfolioTabAccount>;
  authAccount: TCryptoAccount | undefined;
  selectedAddress: string | null;
  onConnectWallet: () => void;
  showVerify: boolean;
  onVerifyWallet: () => void;
  onAddAddress: (address: string) => void;
  onRemoveAddress: (address: string) => void;
  onSelectAddress: (address: string) => void;
  portfolioDataForAddresses: TPortfolioDataForAddress;
  nftBalanceForAddresses: TPortfolioNFTDataForAddress;
  portfolioDataForAddress: TPortfolioDataForAddress | undefined;
  balancesQueryFailed: boolean;
  toggleBalance: () => void;
  showBalance: boolean;
  toggleShowAllAssets: () => void;
  showAllAssets: boolean;
  switchPortfolioType: () => void;
  portfolioType: EPortfolioType;
  ethPrice?: number | undefined;
  widgetHeight: number;
  nftsQueryFailed: boolean;
}

const Portfolio: FC<IPortfolio> = ({
  selectedAddress,
  accounts,
  onConnectWallet,
  showVerify,
  onVerifyWallet,
  portfolioDataForAddress,
  portfolioDataForAddresses,
  ethPrice,
  isLoading,
  onAddAddress,
  onRemoveAddress,
  onSelectAddress,
  balancesQueryFailed,
  toggleBalance,
  showBalance,
  toggleShowAllAssets,
  showAllAssets,
  widgetHeight,
  portfolioType,
  switchPortfolioType,
  nftBalanceForAddresses,
  nftsQueryFailed,
  authAccount,
}) => {
  const [addrScroll, setAddrScroll] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showEnterAddress, setShowEnterAddress] = useState(false);
  const [disableAddAddressInput, setDisableAddAddressInput] = useState(true);

  const portfolioData = !showAllAssets
    ? portfolioDataForAddress
    : portfolioDataForAddresses;

  const handleShowEnterAddress = () => setShowEnterAddress((prev) => !prev);

  const handleTagScroll = () => {
    let timer;
    setAddrScroll(true);
    clearTimeout(timer);
    timer = setTimeout(() => setAddrScroll(false), 1500);
  };

  const onInputChange = (addr: string) =>
    setDisableAddAddressInput(!validateHexOrEnsAddr(addr.toLowerCase()));

  useEffect(() => {
    document
      .getElementById("portfolioAddrContainer")
      ?.addEventListener("scroll", handleTagScroll);
  }, []);

  return (
    <CardBody>
      {isLoading ? (
        <ModuleLoader height={`${String(widgetHeight)}px`} />
      ) : (
        <>
          {/* fragment to avoid nested tenary lint error */}
          {selectedAddress ? (
            <>
              {showVerify && (
                <StyledButtonsWrap>
                  <AlphaButton variant="primaryXL" onClick={onVerifyWallet}>
                    Verify Wallet
                  </AlphaButton>
                </StyledButtonsWrap>
              )}
              <AddressTabSelect
                accounts={accounts}
                authAccount={authAccount}
                addrScroll={addrScroll}
                showAllAssets={showAllAssets}
                toggleShowAllAssets={toggleShowAllAssets}
                selectedAddress={selectedAddress}
                onSelectAddress={onSelectAddress}
                handleShowEnterAddress={handleShowEnterAddress}
                onRemoveAddress={onRemoveAddress}
                disableAccountSelection={false}
              />
              <AssetSwitch
                portfolioType={portfolioType}
                switchPortfolioType={switchPortfolioType}
              />
              {portfolioType === EPortfolioType.Ft ? (
                <PortfolioStats
                  showAll={showAll}
                  showBalance={showBalance}
                  showAllAssets={showAllAssets}
                  portfolioData={portfolioData}
                  ethPrice={ethPrice}
                  balancesQueryFailed={balancesQueryFailed}
                  toggleBalance={toggleBalance}
                />
              ) : (
                <NftList
                  nftData={nftBalanceForAddresses}
                  widgetHeight={widgetHeight}
                  nftsQueryFailed={nftsQueryFailed}
                />
              )}
            </>
          ) : (
            <StyledButtonsWrap>
              <div className="wrap">
                <AlphaButton
                  variant="primaryXL"
                  title="Connect your Metamask Wallet"
                  onClick={onConnectWallet}
                >
                  Connect Wallet
                </AlphaButton>
                <AlphaButton
                  variant="secondaryXL"
                  title="Enter a wallet address"
                  onClick={handleShowEnterAddress}
                >
                  Enter Address
                </AlphaButton>
              </div>
            </StyledButtonsWrap>
          )}
        </>
      )}
      <AddressInput
        onChange={onInputChange}
        onAddAddress={onAddAddress}
        show={showEnterAddress}
        onClose={() => setShowEnterAddress(false)}
        disabled={disableAddAddressInput}
      />
      {portfolioType === EPortfolioType.Ft &&
        !showEnterAddress &&
        (portfolioData?.assets?.length || 0) > 3 && (
          <CollapseFooter
            showAll={showAll}
            handleShowAll={() => setShowAll((prev) => !prev)}
          />
        )}
    </CardBody>
  );
};

export default Portfolio;
