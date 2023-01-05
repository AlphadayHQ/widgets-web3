/* eslint-disable react/button-has-type */
import { ChangeEvent, FC, FocusEvent, MouseEvent } from "react";
import Feedback from "../forms/forms-elements/feedback";
import { StyledInput, StyledWrap } from "./AlphaInput.style";

type TInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface IInputProps {
    className?: string;
    type?: string;
    feedbackText?: string;
    readonly?: boolean;
    id: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    value?: string | number;
    showState?: boolean;
    showErrorOnly?: boolean;
    state?: "success" | "warning" | "error";
    onChange?: (e: ChangeEvent<TInput>) => void;
    onClick?: (e: MouseEvent<TInput>) => void;
    onBlur?: (e: FocusEvent<TInput>) => void;
    width?: string;
    height?: string;
}

export const AlphaInput: FC<IInputProps> = ({
    disabled,
    state,
    feedbackText,
    id,
    name,
    onChange,
    onClick,
    onBlur,
    value,
    readonly,
    width,
    height,
    showState,
    showErrorOnly,
    ...restProps
}) => {
    return (
        <StyledWrap>
            <StyledInput
                disabled={disabled}
                id={id}
                name={name}
                onChange={onChange}
                onClick={onClick}
                onBlur={onBlur}
                value={value}
                readOnly={readonly}
                $width={width}
                $height={height}
                $hasError={state === "error"}
                {...restProps}
            />
            {feedbackText && showState && (
                <Feedback
                    state={state}
                    showState={showState}
                    showErrorOnly={showErrorOnly}
                >
                    {feedbackText}
                </Feedback>
            )}
        </StyledWrap>
    );
};
