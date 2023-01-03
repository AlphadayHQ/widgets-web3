import { FC } from "react";
import { ReactComponent as CloseSVG } from "src/assets/icons/close3.svg";
import { AlphaButton } from "../buttons/AlphaButton";

import {
    StyledModal,
    StyledModalHeader,
    StyledModalTitle,
    StyledModalFooter,
    StyledModalBody,
} from "./AlphaDialog.style";

export interface IModal {
    show: boolean;
    title: string;
    saveButtonText: string;
    closeButtonText?: string;
    onSave?: () => MaybeAsync<void>;
    disableSave?: boolean;
    onClose: () => void;
    showXButton: boolean;
    size?: "xl" | "lg" | "md" | "sm";
    children?: React.ReactNode;
}
export const AlphaDialog: FC<IModal> = ({
    children,
    title,
    onClose,
    onSave,
    disableSave,
    saveButtonText,
    closeButtonText,
    showXButton,
    ...restProps
}) => {
    return (
        <>
            <StyledModal {...restProps}>
                <StyledModalHeader>
                    <StyledModalTitle>{title}</StyledModalTitle>
                    {showXButton && (
                        <button
                            onClick={onClose}
                            className="close"
                            title="close"
                            type="button"
                        >
                            <CloseSVG className="icon" />
                        </button>
                    )}
                </StyledModalHeader>
                <StyledModalBody>{children}</StyledModalBody>

                <StyledModalFooter>
                    {onSave && saveButtonText && (
                        <AlphaButton
                            extraClassStyles="alphaDialog"
                            onClick={onSave}
                            disabled={disableSave === true}
                        >
                            {saveButtonText}
                        </AlphaButton>
                    )}
                    {onClose && closeButtonText && (
                        <AlphaButton
                            extraClassStyles="alphaDialog"
                            onClick={onClose}
                        >
                            {closeButtonText}
                        </AlphaButton>
                    )}
                </StyledModalFooter>
            </StyledModal>
        </>
    );
};
