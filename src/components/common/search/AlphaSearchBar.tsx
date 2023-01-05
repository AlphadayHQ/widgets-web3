/* eslint-disable react/button-has-type */
import { useState, useEffect, useCallback } from "react";
import { themes } from "../../../styles";
import Select, {
    components,
    GroupBase,
    StylesConfig,
    ActionMeta,
    InputActionMeta,
    InputProps,
    NoticeProps,
    CSSObjectWithLabel,
} from "react-select";
import {
    StyledCustomPlaceholder,
    StyledSearchContainer,
    StyledEmptyResultsContainer,
} from "./AlphaSearchBar.style";

/**
 * for simplicity, all components types here are defined with IsMulti = true
 * Supporting an arbitrary value for IsMulti would require some additional refactoring
 */

interface IProps {
    disabled?: boolean;
    $uppercase?: boolean;
}

const { Input, NoOptionsMessage } = components;

const CustomInput = <Option extends unknown>(
    props: InputProps<Option, true, GroupBase<Option>>
) => {
    const { isDisabled, value } = props;
    return !isDisabled ? (
        <>
            <Input {...props} />
            {!value && (
                <StyledCustomPlaceholder>Search...</StyledCustomPlaceholder>
            )}
        </>
    ) : null;
};

const CustomNoOptionsMessage = <Option extends unknown>(
    props: NoticeProps<Option, true, GroupBase<Option>>
) => {
    return (
        <NoOptionsMessage {...props}>
            <StyledEmptyResultsContainer>
                No results
            </StyledEmptyResultsContainer>
        </NoOptionsMessage>
    );
};

export interface ISearchProps<Option = unknown> {
    options?: Option[];
    disabled?: boolean;
    uppercase?: boolean;
    label?: string;
    placeholder: string;
    initialSearchValues: Option[];
    menuIsOpen?: boolean;
    closeMenuOnSelect?: boolean;
    updateSearch?: boolean;
    onChange: (
        o: Readonly<Option[]>,
        actionType: ActionMeta<Option>
    ) => void | ((o: Option[]) => Promise<void>);
    onInputChange?: (e: string) => void;
    customStyles?: Partial<
        Record<
            keyof StylesConfig<Option, true, GroupBase<Option>>,
            CSSObjectWithLabel
        >
    > &
        IProps;
}

export const AlphaSearchBar = <Option extends unknown>({
    disabled,
    onChange,
    onInputChange,
    options,
    placeholder,
    initialSearchValues,
    menuIsOpen = false,
    closeMenuOnSelect = false,
    updateSearch = true,
    customStyles,
}: ISearchProps<Option>): ReturnType<React.FC<ISearchProps>> => {
    // TODO pass theme
    // const { theme } = useAppSelector((state) => state.ui);
    const {
        backgroundVariant200,
        backgroundVariant400,
        primaryVariant100,
        backgroundVariant600,
        btnBackgroundVariant1400,
        primary,
    } = themes["dark"].colors;

    const [searchValues, setSearchValues] = useState<Option[]>(
        initialSearchValues
    );
    const [inputValue, setInputValue] = useState("");

    // reset state if initial search values changed
    useEffect(() => {
        setSearchValues(initialSearchValues);
    }, [initialSearchValues]);

    const handleSearchValues = (
        e: Readonly<Option[]>,
        actionType: ActionMeta<Option>
    ) => {
        onChange(e, actionType);
        if (updateSearch) setSearchValues([...e]);
    };

    const handleInputChange = useCallback(
        (value: string, meta: InputActionMeta) => {
            if (["input-blur", "menu-close"].indexOf(meta.action) === -1) {
                setInputValue(value);
                if (onInputChange) onInputChange(value);
                return value;
            }
            return inputValue;
        },
        [inputValue, onInputChange]
    );

    const selectStyles: StylesConfig<Option, true, GroupBase<Option>> &
        IProps = {
        container: (styles) => ({
            ...styles,
            ...customStyles?.container,
        }),
        control: (styles, { isFocused }) => ({
            ...styles,
            cursor: "text",
            "&:hover": {
                backgroundColor: backgroundVariant200,
            },
            backgroundColor: isFocused
                ? backgroundVariant200
                : backgroundVariant400,
            border: 0,
            boxShadow: "none",
            borderRadius: "10px",
            height: "41px",
            minHeight: "41px",
            ...customStyles?.control,
        }),
        placeholder: (styles) => {
            return {
                ...styles,
                marginLeft: "15px",
                fontFamily: "Open Sans",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "16px",
                letterSpacing: "0.2px",
                color: primaryVariant100,
                ...customStyles?.placeholder,
            };
        },
        multiValue: (styles) => {
            return {
                ...styles,
                backgroundColor: btnBackgroundVariant1400,
                borderRadius: "8px",
                margin: "0",
                marginLeft: "6px",
                lineHeight: "16px",
                padding: "6px",
                "& div": {
                    color: primary,
                    fontSize: "13px",
                    padding: "0px",
                    margin: "0px 0px 0px 5px",
                    cursor: "pointer",
                },
                "& div:hover": { background: "transparent" },
                "& div:nth-of-type(2)": {
                    display: "contents",
                    margin: 0,
                    cursor: "pointer",
                    svg: {
                        fill: primary,
                        margin: "1px 0px",
                        width: "15px",
                        height: "14px",
                        padding: "3px 0px",
                    },
                },
                ...customStyles?.multiValue,
            };
        },
        valueContainer: (styles) => {
            return {
                ...styles,
                padding: "0px 4px",
                height: "41px",
                flexWrap: "nowrap",
                overflowX: "scroll",
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                div: {
                    minWidth: "max-content",
                },
                ...customStyles?.valueContainer,
            };
        },
        input: (styles) => {
            return {
                ...styles,
                margin: "0px 0px 0px 10px",
                padding: "0px",
                color: primary,
                border: 0,
                ...customStyles?.input,
            };
        },
        indicatorSeparator: (styles) => {
            return {
                ...styles,
                display: "none",
            };
        },
        menu: (styles) => {
            return {
                ...styles,
                background: backgroundVariant200,
                fontWeight: "bold",
                fontSize: "12px",
                lineHeight: "17px",
                boxShadow: "0px 0px 35px 14px rgba(19, 21, 27, 0.8)",
                ...customStyles?.menu,
            };
        },
        menuList: (styles) => {
            return {
                ...styles,

                "::-webkit-scrollbar": {
                    width: "4px",
                    height: "0px",
                },
                "::-webkit-scrollbar-track": {
                    background: "#1e2025",
                },
                "::-webkit-scrollbar-thumb": {
                    background: "#c1c5d6",
                },
                "::-webkit-scrollbar-thumb:hover": {
                    background: "#555555",
                },
                ...customStyles?.menuList,
            };
        },
        option: (provided, { isFocused }) => ({
            ...provided,
            color: primary,
            backgroundColor: isFocused ? backgroundVariant600 : "transparent",
            "&:active": {
                backgroundColor: "transparent",
            },
            ...customStyles?.option,
        }),
    };

    return (
        <StyledSearchContainer>
            <Select
                onChange={(e, type) => handleSearchValues(e, type)}
                onInputChange={handleInputChange}
                isClearable
                isMulti
                options={options}
                value={searchValues}
                closeMenuOnSelect={closeMenuOnSelect}
                components={{
                    DropdownIndicator: null,
                    Input: CustomInput,
                    NoOptionsMessage: CustomNoOptionsMessage,
                }}
                styles={selectStyles}
                placeholder={placeholder}
                isDisabled={disabled}
                menuIsOpen={menuIsOpen}
            />
        </StyledSearchContainer>
    );
};
