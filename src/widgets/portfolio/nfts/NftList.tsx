import React, { FC } from "react";
import { TZapperNftAsset } from "../../../api/services";
import ScrollBar from "../../../components/common/scrollbar/scrollbar";
import globalMessages from "../../../globalMessages";
import { StyledMessage, StyledNftsList, StyledNftsWrap } from "../style";
import { TPortfolioNFTDataForAddress } from "../types";
import NftCard from "./NftCard";
import CONFIG from "../../../config";

const { API_BASE_URL } = CONFIG.API_PROVIDERS.IPFS_GATEWAY;

interface INftList {
    nftData: TPortfolioNFTDataForAddress;
    widgetHeight: number;
    nftsQueryFailed: boolean;
}

const NftList: FC<INftList> = ({ nftData, widgetHeight, nftsQueryFailed }) => {
    const getImage = (data: TZapperNftAsset) => {
        const url = data.token.medias.find((media) => media.type === "image")
            ?.originalUrl;

        if (url?.includes("ipfs://")) {
            const cid = url?.split("ipfs://")?.[1];
            return cid ? `${API_BASE_URL}${String(cid)}` : undefined;
        }

        return url;
    };

    return (
        <StyledNftsList $widgetHeight={widgetHeight}>
            {nftsQueryFailed ? (
                <StyledMessage>
                    {globalMessages.error.requestFailed("your nfts")}
                </StyledMessage>
            ) : (
                <>
                    {nftData.items.length === 0 ? (
                        <StyledMessage>
                            No NFTs found for the wallet(s) provided.
                        </StyledMessage>
                    ) : (
                        <ScrollBar>
                            <StyledNftsWrap>
                                {nftData.items.map((item) => (
                                    <NftCard
                                        key={
                                            item.token.collection.openseaId +
                                            item.token.tokenId.toString()
                                        }
                                        img={getImage(item)}
                                        collectionLogo={
                                            item.token.collection.logoImageUrl
                                        }
                                        name={item.token.name}
                                        value={item.token.estimatedValueEth?.slice(
                                            0,
                                            5
                                        )}
                                    />
                                ))}
                            </StyledNftsWrap>
                        </ScrollBar>
                    )}
                </>
            )}
        </StyledNftsList>
    );
};

export default NftList;
