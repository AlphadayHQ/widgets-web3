/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    IFeedback,
    TCustomStyle,
} from "../forms/forms-elements/types";
import styled, { css } from "../../../styles";
// import {
//     InputStyles,
//     SuccessInputStyles,
//     WarningInputStyles,
//     ErrorInputStyles,
//     allowedProps,
// } from "../style";

interface IInput extends IFeedback {
    $width?: string | any[];
    $height?: string | any[];
    $customStyle?: TCustomStyle;
    $hasError?: boolean;
}
export const StyledWrap = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
`;

export const StyledInput = styled.input<IInput>`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 12px 15px;

    width: ${({ $width }) => $width || "359px"};
    height: ${({ $height }) => $height || "40px"};

    background: ${({ theme }) => theme.colors.backgroundVariant400};
    border-radius: 10px;
    /* border: 1px solid #477ff7; */ // special case

    &::placeholder {
        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        /* identical to box height, or 123% */

        letter-spacing: 0.2px;

        /* Primary/Light */

        color: #505562;

        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;
        margin: 0px 10px;
    }

    &:active,
    &:focus {
        border: transparent;
    }

    &:hover {
        border: 1px solid #505562;
        &::placeholder {
            color: #c2c5d6;
        }
    }

    ${({ $hasError }) =>
        $hasError
            ? css`
                  border: 1px solid #ff5f58;
              `
            : ""}; // onError
`;
