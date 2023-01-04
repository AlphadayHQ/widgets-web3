import React, { FC, useState } from "react";
import { ReactComponent as NoImageSVG } from "src/assets/svg/no-image.svg";
import { StyledNftCard } from "../style";

interface INft {
    img: string | undefined;
    collectionLogo: string;
    name: string;
    value: string | undefined;
}

const NftCard: FC<INft> = ({ img, name, value }) => {
    const [imgLoadFailed, setImgLoadFailed] = useState(false);
    const [videoLoadFailed, setVideoLoadFailed] = useState(false);
    return (
        <StyledNftCard $isEstValue={!value === undefined}>
            <div className="card">
                <div className="face face1">
                    {img && !videoLoadFailed ? (
                        <>
                            {!imgLoadFailed ? (
                                <img
                                    src={img}
                                    onError={() => setImgLoadFailed(true)}
                                    className="img"
                                    alt={name}
                                />
                            ) : (
                                // eslint-disable-next-line jsx-a11y/media-has-caption
                                <video
                                    className="img"
                                    onError={() => setVideoLoadFailed(true)}
                                >
                                    <source src={img} />
                                </video>
                            )}
                        </>
                    ) : (
                        <NoImageSVG className="no-image" />
                    )}
                </div>
                <div className="face face2">
                    <div className="title">
                        <span className="name">#{name}</span>
                        {value && (
                            <div className="value" title="Value in Eth">
                                <span>Est. value</span>
                                <p>Ξ {value}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StyledNftCard>
    );
};

export default NftCard;
