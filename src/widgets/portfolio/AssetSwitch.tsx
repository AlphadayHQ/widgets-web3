import React, { FC } from "react";
import { AlphaSwitch } from "../../components/common/tab-switchers/AlphaSwitch";
import { StyledSwitch } from "./style";
import { EPortfolioType } from "./types";

interface IAssetSwitch {
    switchPortfolioType: () => void;
    portfolioType: EPortfolioType;
}

const AssetSwitch: FC<IAssetSwitch> = ({
    switchPortfolioType,
    portfolioType,
}) => {
    return (
        <StyledSwitch>
            <AlphaSwitch
                options={["Assets", "NFTs"]}
                onChange={switchPortfolioType}
                checked={portfolioType === EPortfolioType.Nft}
            />
        </StyledSwitch>
    );
};

export default AssetSwitch;
