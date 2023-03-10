import { SUPPORTED_EVM_NETWORKS } from "../../config/thirdparty";
import { TZapperAsset } from "../services";

export const getAssetPrefix = (a: TZapperAsset): string => {
    const networks = SUPPORTED_EVM_NETWORKS;

    if (a.network === "ethereum") return "";
    const prefix: string =
        networks[a.network.toLowerCase() as keyof typeof networks].abbrev;
    return `(${prefix})`;
};
