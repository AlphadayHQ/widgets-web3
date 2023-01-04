import { TBaseItem } from "./primitives";

export type TNewsItem = Omit<TBaseItem, "tags"> & {
    author: string;
    publishedAt: string;
};
