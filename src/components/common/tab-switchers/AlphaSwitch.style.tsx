import styled, { css, device } from "../../../styles";
import CONFIG from "../../../config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

interface IProps  {
    $options: [string, string];
    $checked: boolean;
    disabled?: boolean;
    $uppercase?: boolean;
}

const switchStyles = css<IProps>`
    position: relative;
    display: inline-block;
    color: ${({ theme }) => theme.colors.primary};

    input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background-color: ${({ theme }) =>
            theme.colors.btnBackgroundVariant1100};
        border-radius: 10px;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    .options {
        margin: 2px;
        min-width: 62px;
        text-align: center;
        text-transform: capitalize;
        font-weight: 600;
        font-size: 12px;
        line-height: 17px;
        z-index: ${Z_INDEX_REGISTRY.SWITCH};
        -webkit-transition: 0.4s;
        transition: 0.4s;
        border-radius: 8px;
        padding: 3px 8px;
        ${device.tiny} {
            min-width: min-content;
        }
    }

    input {
        position: absolute;
    }

    .option1:hover,
    .option2:hover {
        background-color: ${({ theme }) =>
            theme.colors.btnBackgroundVariant1200};
    }

    .option1:active,
    .option2:active {
        background-color: ${({ theme }) =>
            theme.colors.btnBackgroundVariant1600};
    }

    input:not(:checked) + .slider {
        .option1 {
            background-color: ${({ theme }) =>
                theme.colors.btnBackgroundVariant1400};
        }
    }

    input:checked + .slider {
        .option2 {
            background-color: ${({ theme }) =>
                theme.colors.btnBackgroundVariant1400};
        }
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(61px);
        -ms-transform: translateX(61px);
        transform: translateX(61px);
    }

    ${({ disabled }) =>
        disabled &&
        css`
            color: ${({ theme }) => theme.colors.primaryVariant300};
            pointer-events: none;
            input:not(:checked) + .slider {
                .option1 {
                    background-color: ${({ theme }) =>
                        theme.colors.primaryVariant300};
                }
            }

            input:checked + .slider {
                .option2 {
                    background-color: ${({ theme }) =>
                        theme.colors.primaryVariant300};
                }
            }
        `}
`;

export const StyledSwitch = styled.label<IProps>`
    ${switchStyles}
`;

StyledSwitch.defaultProps = {
    $options: ["true", "false"],
    $checked: true,
};
