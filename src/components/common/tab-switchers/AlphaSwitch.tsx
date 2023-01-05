/* eslint-disable react/button-has-type */
import { FC } from "react";
import { StyledSwitch } from "./AlphaSwitch.style";

export interface SwitchProps {
    options: [string, string];
    checked?: boolean;
    disabled?: boolean;
    uppercase?: boolean;
    label?: string;
    title?: string;
    onChange?: () => void | (() => Promise<void>);
}

export const AlphaSwitch: FC<SwitchProps> = ({
    options,
    checked,
    disabled,
    uppercase,
    label,
    ...restProps
}) => {
    return (
        <StyledSwitch
            $options={options}
            $checked={checked || false}
            disabled={disabled}
            $uppercase={uppercase}
            aria-label={label}
            {...restProps}
        >
            <input
                readOnly
                type="checkbox"
                aria-label={label}
                checked={checked}
            />
            <span className="slider">
                <span className="options option1">{options[0]}</span>
                <span className="options option2">{options[1]}</span>
            </span>
        </StyledSwitch>
    );
};

AlphaSwitch.defaultProps = {
    options: ["true", "false"],
    checked: true,
    disabled: false,
    uppercase: true,
    label: "switch",
};
