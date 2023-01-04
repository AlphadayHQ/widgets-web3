// import PortfolioContainer from "src/containers/portfolio/PortfolioContainer";

import PortfolioContainer from "../containers/portfolio/PortfolioContainer";
import { TUserViewWidget } from "./views";

/**
 * For all widget templates, we use types as defined in the container's type args.
 *
 * This type is used to define the type of the data that is passed to its resulting widget's structure.
 * This way, the data can be handled properly in the templates container before the data is passed to the modules.
 * By default, this data type is unknown, but can be overridden in the template's container.
 */
export interface IWidgetContainer<T = unknown> {
  uiProps: {
    onToggleShowFullSize?: (val: "open" | "close") => void;
    showFullSize?: boolean;
    allowFullSize?: boolean;
    dragProps?: {
      "data-rbd-drag-handle-draggable-id"?: string | undefined;
      "data-rbd-drag-handle-context-id"?: string | undefined;
      "aria-describedby"?: string | undefined;
      role?: string | undefined;
      tabIndex?: number | undefined;
      draggable?: boolean | undefined;
      onDragStart?: React.DragEventHandler<unknown> | undefined;
    };
    isDragging?: boolean;
    setTutFocusElemRef:
      | React.Dispatch<React.SetStateAction<HTMLElement | null>>
      | undefined;
  };
  moduleData: TUserViewWidget<T>;
}

export enum ETemplateNameRegistry {
  Portfolio = "portfolio",
}

export type TTemplateSlug = `${ETemplateNameRegistry}_template`;
export type TBaseWidgetSlug = `${ETemplateNameRegistry}_widget`;
export type TWidgetSlug = `${string}_${TBaseWidgetSlug}` | TBaseWidgetSlug;

/**
 * Widget specific types
 *
 * Here we define types for each module containers
 */
// export type TItem = TDynamicItem<string>;

export type TCategoryData = {
  name: string;
  description: string;
};

/**
 * When a template has a dynamic data type, we need to define the type of the data that would passed to the widget's structure here.
 * This way, the template component would be identified. `TItem` should suffice in most cases.
 * However, if the data type is known explicitly, then we should add it here as well
 */
export type TTemplateComponent = React.FC<IWidgetContainer>;

export interface IModule {
  id: TWidgetSlug;
  slug: TTemplateSlug;
  Component: React.FC<IWidgetContainer<unknown>>;
}

export type TTemplatesDict = {
  [key in TTemplateSlug]: TTemplateComponent;
};

export const TEMPLATES_DICT: TTemplatesDict = {
  portfolio_template: PortfolioContainer,
}

export enum EWidgetSettingsRegistry {
  IncludedTags = "included_tags_setting",
  // ...add other settings here
}

export type TFullSizeRoute = {
  [path in string]?: TTemplateSlug;
};

/**
 * Whats the big idea behind string indexes?
 * - it allows to use any path not just the ones defined in the enum
 * - it allows for ease of matching paths without an overkill of type comparisons.
 * - it allows for easy addition of new paths without the need to update the enum
 */
// TODO add calendar
// export const FULLSIZE_ROUTE_DICT: TFullSizeRoute = {
//   calendar: "calendar_template",
// };
