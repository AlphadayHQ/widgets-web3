import { FC, useCallback, useRef, useState } from "react";
import { useWindowSize } from "../../hooks";
import { breakpoints } from "../../styles";
import { ReactComponent as CloseSVG } from "../assets/icons/close3.svg";
import { ReactComponent as MaximizeSVG } from "../assets/icons/maximize.svg";
import { ReactComponent as FlipSVG } from "../assets/icons/flip.svg";
import { ReactComponent as InfoSVG } from "../assets/icons/info.svg";
import { ReactComponent as TrashSVG } from "../assets/icons/trash.svg";
import { ReactComponent as SettingsSVG } from "../assets/icons/settings.svg";
import CONFIG from "../../config";
// import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
// import {
//   toggleCollapse as toggleCollapseInStore,
//   selectIsMinimised,
// } from "src/api/store";
import { TKeyword, TTag, ETag } from "../../types/primitives";
import {
  EWidgetSettingsRegistry,
  IWidgetContainer,
} from "../../types/widgetContainer";
import {
  ModuleWrapper,
  ModuleHeader,
  ModuleBody,
  ModuleTitle,
  ModuleFooter,
  ModuleFlip,
} from "./BaseWidget.style";
import { AlphaTabButton } from "../../components/common/tabButtons/AlphaTabButton";
import { AlphaModal } from "../../components/common/modal/AlphaModal";
import { AlphaTooltip } from "../../components/common/tooltips/AlphaTooltip";
import { AlphaDialog } from "../../components/common/dialog/AlphaDialog";
import { AlphaSearchBar } from "../../components/common/search/AlphaSearchBar";
import { AlphaButton } from "../../components/common/buttons/AlphaButton";

const { HEADER_HEIGHT } = CONFIG.WIDGETS.COMMON;
interface IBaseModuleProps extends IWidgetContainer {
  id?: string;
  onToggleHelp?: () => void;
  onToggleSettings?: () => void;
  onToggleCollapse?: () => void;
  showTrashIcon: boolean;
  adjustable?: boolean;
  onRemoveWidget: (hash: string) => void;
  // recall: not all widgets should display tags
  onRemoveTag?: (hash: string, tagId: number) => void;
  onAdjustWidgetHeight?: React.Dispatch<React.SetStateAction<number>>;
  children?: React.ReactNode;
  onIncludeTag?: (hash: string, tag: TTag) => void;
  keywordsList?: TKeyword[];
  setSearchState?: (val: string) => void;
  searchState?: string;
  visible?: boolean;
}

/**
 * BaseModule Component that should be reused by most app modules (market,
 * news, tvl, etc.)
 */
const BaseModule: FC<IBaseModuleProps> = ({
  id,
  uiProps,
  children,
  onToggleCollapse,
  moduleData,
  onRemoveWidget,
  onRemoveTag,
  onAdjustWidgetHeight,
  adjustable,
  onIncludeTag,
  keywordsList,
  setSearchState,
  searchState,
  visible,
}) => {
  const {
    onToggleShowFullSize,
    showFullSize,
    allowFullSize,
    dragProps,
    setTutFocusElemRef,
  } = uiProps;
  // const dispatch = useAppDispatch();
  const { width } = useWindowSize();
  const moduleWrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // TODO connect to isCollapsed state
  // const isCollapsed = useAppSelector(selectIsMinimised(moduleData.hash));

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [showSettings, setShowSettings] = useState<boolean | undefined>();
  const handleShowDialog = () => {
    setShowMobileDialog(false);
  };
  const toggleCollapse = useCallback(() => {
    // dispatch(toggleCollapseInStore({ widgetHash: moduleData.hash }));
    if (onToggleCollapse != null) onToggleCollapse();
    setIsCollapsed((prev) => !prev);
  }, [
    // dispatch,
    // moduleData.hash,
    onToggleCollapse,
  ]);

  const toggleSettings = useCallback(() => {
    // widget options uses the height of the widget. The widget must be expanded before the options can be shown
    if (!isCollapsed) setShowSettings((showSetting) => !showSetting);
  }, [isCollapsed]);

  const handleShowFullSize = () => {
    if (width !== undefined && width < breakpoints[1])
      setShowMobileDialog(true);
    // expand regular size module since fullsize modal is already open
    if (onToggleShowFullSize != null) {
      if (showFullSize) onToggleShowFullSize("close");
      else onToggleShowFullSize("open");
    }
  };

  const removeWidget = () => {
    onRemoveWidget(moduleData.hash);
  };

  const title = moduleData.widget.name.toUpperCase();

  const tooltipText = moduleData.widget.description;

  const tagsSettings = moduleData.settings.filter(
    (s) => s.setting.slug === EWidgetSettingsRegistry.IncludedTags
  );
  const tags = tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

  const adjustHeight = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (!moduleWrapRef.current || !onAdjustWidgetHeight) return;
    const startHeight = moduleWrapRef.current.clientHeight; // Current widget Height
    const { pageY: startPosY } = event;

    const resize = (e: MouseEvent) => {
      const dy = e.pageY - startPosY;
      const headerHeight = headerRef.current?.clientHeight || HEADER_HEIGHT;
      onAdjustWidgetHeight(startHeight - headerHeight + dy);
    };

    const stopResize = () => {
      document?.removeEventListener("mousemove", resize, false);
      document?.removeEventListener("mouseup", stopResize, false);
      document?.removeEventListener("mouseleave", stopResize, false);
    };

    document.addEventListener("mouseup", stopResize, false);
    document.addEventListener("mouseleave", stopResize, false);
    document.addEventListener("mousemove", resize, false);
  };

  if (visible === false) return <div id={id} {...dragProps} hidden />;

  return (
    <>
      <ModuleFlip id={moduleData.hash}>
        <div className="flip-inner">
          <ModuleWrapper
            className={`flip ${showSettings ? "flipped" : ""}`}
            ref={moduleWrapRef}
          >
            <div
              ref={(ref) =>
                setTutFocusElemRef && ref && setTutFocusElemRef(ref)
              }
              id={id}
              {...dragProps}
            >
              <ModuleHeader ref={headerRef}>
                <div className="header">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleCollapse()}
                    className="wrap"
                  >
                    <ModuleTitle>{title}</ModuleTitle>
                    {tags && (
                      <>
                        <span className="searchTags">
                          {tags.map((tag) => (
                            <span
                              role="button"
                              key={tag.id}
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation(); // Doing this on StyledButton doesn't work.
                              }}
                            >
                              <AlphaTabButton
                                variant="transparent"
                                open={false}
                                onClose={() => {
                                  if (onRemoveTag) {
                                    onRemoveTag(moduleData.hash, tag.id);
                                  }
                                }}
                              >
                                {tag.name}
                              </AlphaTabButton>
                            </span>
                          ))}
                        </span>
                      </>
                    )}
                  </span>
                  <AlphaTooltip
                    width="373px"
                    tooltipText={tooltipText}
                    className="tooltip"
                    hiddenCloseButton
                  >
                    <div
                      className="button info"
                      role="button"
                      title="Widget Info"
                      tabIndex={0}
                    >
                      <InfoSVG />
                    </div>
                  </AlphaTooltip>
                  {/** if the widget is collapsed, let's not show the toggle settings option.
                   * settings makes use of the widget height, so it should be expanded before showing the settings
                   */}
                  {!isCollapsed && moduleData.settings.length > 0 && (
                    <div
                      className="button"
                      onClick={toggleSettings}
                      title="Widget Options"
                      role="button"
                      tabIndex={0}
                    >
                      <SettingsSVG />
                    </div>
                  )}
                  {allowFullSize && (
                    <div
                      className="button"
                      onClick={handleShowFullSize}
                      title="Expand Widget"
                      role="button"
                      tabIndex={0}
                    >
                      <MaximizeSVG />
                    </div>
                  )}
                </div>
              </ModuleHeader>
            </div>
            {!isCollapsed && !showFullSize && (
              <ModuleBody>{children}</ModuleBody>
            )}

            {adjustable && (
              <div
                onMouseDown={adjustHeight}
                className="adjust-height-handle"
                role="button"
                title="Adjust widget height"
                tabIndex={-1}
              />
            )}
          </ModuleWrapper>
          <ModuleWrapper
            className={`flip ${!showSettings ? "flipped" : ""}`}
            $height={moduleWrapRef.current?.clientHeight}
          >
            <div {...uiProps.dragProps}>
              <ModuleHeader>
                <div className="header">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleCollapse()}
                  >
                    <ModuleTitle>{title} OPTIONS</ModuleTitle>
                  </span>
                  <div
                    className="button"
                    onClick={toggleSettings}
                    role="button"
                    title="Close Widget Options"
                    tabIndex={0}
                  >
                    <FlipSVG fill="currentColor" />
                  </div>
                </div>
              </ModuleHeader>
            </div>
            <ModuleBody>
              <div className="settings">
                <div className="setting-title">Included Tags:</div>
                <AlphaSearchBar
                  options={
                    searchState
                      ? keywordsList?.map(({ tag }) => ({
                          ...tag,
                          label: tag.name,
                          value: tag.id,
                        }))
                      : undefined
                  }
                  updateSearch={false}
                  initialSearchValues={[]}
                  closeMenuOnSelect
                  menuIsOpen={!!searchState}
                  onInputChange={setSearchState}
                  placeholder="ethereum, bitcoin, etc."
                  onChange={([tag]) => {
                    if (!tag) return;
                    const tagExists = tags?.find((t) => t.id === tag.id);
                    if (tagExists && tagExists.tag_type === ETag.Local) return;
                    onIncludeTag?.(moduleData.hash, {
                      id: tag.id,
                      name: tag.name,
                      slug: tag.slug,
                      tagType: ETag.Local,
                    });
                  }}
                  customStyles={{
                    container: {
                      maxWidth: "300px",
                    },
                    control: {
                      padding: "0 10px",
                      backgroundColor: "#0A0A0B", // TODO: use theme color here
                    },
                    menuList: {
                      maxHeight: "100px",
                    },
                    input: {
                      margin: "0px",
                    },
                    placeholder: {
                      marginLeft: "0px",
                    },
                  }}
                />
                {tags && (
                  <div className="searchTags">
                    {tags.map((tag) => (
                      <span
                        role="button"
                        key={tag.id}
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation(); // Doing this on StyledButton doesn't work.
                        }}
                        className={
                          tag.tag_type === ETag.Local ? "persisted" : ""
                        }
                      >
                        <AlphaTabButton
                          variant="transparent"
                          open={false}
                          onClose={() => {
                            if (onRemoveTag) {
                              onRemoveTag(moduleData.hash, tag.id);
                            }
                          }}
                        >
                          {tag.name}
                        </AlphaTabButton>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </ModuleBody>
            <ModuleFooter>
              <AlphaButton variant="small" onClick={removeWidget}>
                <TrashSVG width="15px" fill="inherit" /> &nbsp; Remove Widget
              </AlphaButton>
            </ModuleFooter>

            {adjustable && (
              <div
                onMouseDown={adjustHeight}
                className="adjust-height-handle"
                role="button"
                title="Adjust widget height"
                tabIndex={-1}
              >
                <span className="child" title="Adjust widget height" />
                <span className="child two" title="Adjust widget height" />
              </div>
            )}
          </ModuleWrapper>
        </div>
      </ModuleFlip>
      {onToggleShowFullSize && allowFullSize && (
        <AlphaModal show={!!showFullSize} onClose={handleShowFullSize}>
          <ModuleHeader>
            <div className="header">
              <span role="button" tabIndex={0} onClick={toggleCollapse}>
                {title.toUpperCase()}
              </span>
              <div
                className="button"
                onClick={handleShowFullSize}
                role="button"
                title="Expand Widget"
                tabIndex={0}
              >
                <CloseSVG />
              </div>
            </div>
          </ModuleHeader>
          {children}
          <div className="foot-block" />
        </AlphaModal>
      )}
      <AlphaDialog
        title="Alphaday"
        showXButton
        saveButtonText="Close"
        show={showMobileDialog}
        onSave={handleShowDialog}
        onClose={handleShowDialog}
      >
        <p>Switch to Desktop to get the best experience of {title}</p>
      </AlphaDialog>
    </>
  );
};

export default BaseModule;
