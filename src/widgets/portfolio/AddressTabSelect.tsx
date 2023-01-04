import { FC } from "react";
import { ReactComponent as PlusSVG } from "src/assets/alphadayAssets/icons/plus.svg";
import { truncateWithEllipsis } from "../../api/utils/textUtils";
import { TCryptoAccount } from "../../api/types";
import { StyledAddresses, StyledAddressesWrap } from "./style";
import { AlphaTabButton } from "../../components/common/tabButtons/AlphaTabButton";
import { TPortfolioTabAccount } from "./types";

interface IAddressTabSelect {
    selectedAddress: string | null;
    accounts: Array<TPortfolioTabAccount>;
    authAccount: TCryptoAccount | undefined;
    addrScroll: boolean;
    showAllAssets: boolean;
    toggleShowAllAssets: () => void;
    handleShowEnterAddress: () => void;
    onRemoveAddress: (address: string) => void;
    onSelectAddress: (address: string) => void;
    disableAccountSelection: boolean;
}

const AddressTabSelect: FC<IAddressTabSelect> = ({
    accounts,
    addrScroll,
    selectedAddress,
    showAllAssets,
    toggleShowAllAssets,
    handleShowEnterAddress,
    onRemoveAddress,
    onSelectAddress,
    disableAccountSelection,
    authAccount,
}) => {
    return (
        <StyledAddressesWrap id="portfolioAddrContainer" scroll={addrScroll}>
            <StyledAddresses>
                <span className="tab-item">
                    <AlphaTabButton
                        open={showAllAssets}
                        onClick={() => {
                            if (!showAllAssets) toggleShowAllAssets();
                        }}
                        variant="extraSmall"
                        uppercase={false}
                    >
                        All Wallets
                    </AlphaTabButton>
                </span>
                {accounts.map((acct) => (
                    <span key={acct.address} className="tab-item">
                        <AlphaTabButton
                            key={acct.address}
                            label={acct.ens || acct.address}
                            uppercase={false}
                            open={
                                !showAllAssets &&
                                selectedAddress === acct.address
                            }
                            onClick={() => {
                                onSelectAddress(acct.address);
                                if (showAllAssets) toggleShowAllAssets();
                            }}
                            onClose={() => {
                                onRemoveAddress(acct.address);
                            }}
                            variant={
                                acct.address !== authAccount?.address
                                    ? "removable"
                                    : "small"
                            }
                            title={acct.address}
                            disabled={disableAccountSelection}
                        >
                            {acct.ens || truncateWithEllipsis(acct.address, 10)}
                        </AlphaTabButton>
                    </span>
                ))}
                <span className="tab-item">
                    <AlphaTabButton
                        variant="extraSmall"
                        open={false}
                        uppercase={false}
                        onClick={handleShowEnterAddress}
                        extraClassStyles="portfolio-addWallet"
                    >
                        <PlusSVG
                            style={{
                                marginRight: "5px",
                            }}
                        />{" "}
                        Add Wallet
                    </AlphaTabButton>
                </span>
            </StyledAddresses>
        </StyledAddressesWrap>
    );
};

export default AddressTabSelect;
