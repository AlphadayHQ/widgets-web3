export enum ETutorialTipId {
    SwitchView = "switch-view",
    UseSeachBar = "use-search-bar",
    ReArrangeWidget = "re-arrange-widget",
    ResizeWidget = "resize-widget",
    MaximizeWidget = "maximize-widget",
    UseWidgetLib = "use-widget-lib",
    ComeBack = "come-back",
}
export enum ETutorialIndicatorType {
    Ring = "ring",
    Rect = "rect",
}
export enum ETutorialTipAlign {
    Left = "left",
    Center = "center",
    Right = "right",
}
export type TTutorialTip = {
    id: ETutorialTipId;
    title: string | undefined;
    text: string;
    align: ETutorialTipAlign | undefined;
};
export type TTutorial = {
    tip: TTutorialTip | undefined;
    pos: DOMRect | undefined;
    tipCount: string;
    indicator: {
        type: ETutorialIndicatorType | undefined;
        animationScale: number | undefined;

        // ? Undecided if we would need this
        // action: {
        //     onClick?: () => void | undefined;
        //     onDrag?: () => void | undefined;
        // };
    };
};
