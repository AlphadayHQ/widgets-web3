import { TCoin } from "../../../api/types";
import {
    TBaseCoin,
    TRemoteBaseProject,
    TRemoteTagReadOnly,
} from "../baseTypes";

/**
 * Primitive types
 */
export type TRemoteCoin = TBaseCoin & {
    project: TRemoteBaseProject;
    tags: TRemoteTagReadOnly[];
};

/**
 * Queries
 */

// /coins/
export type TGetCoinsRequest = void;
export type TGetCoinsRawResponse = TRemoteCoin[];
export type TGetCoinsResponse = Omit<TCoin, "id">[];
