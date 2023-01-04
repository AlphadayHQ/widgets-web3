import { FC } from "react";
import { Portal } from "react-portal";
import { CSSTransition } from "react-transition-group";
import {
    StyledBackdrop,
    StyledModal,
    StyledHeader,
    StyledTitle,
    StyledClose,
    StyledBody,
    StyledFooter,
} from "./style";

export interface IProps {
    /**
     * Pass extra classes
     */
    className?: string;
    children?: React.ReactNode;
}

export interface IModal extends IProps {
    /**
     * When `true` The modal will show itself.
     */
    show: boolean;
    /**
     * Modal Sizes
     */
    size?: "xl" | "lg" | "md" | "sm";
    /**
     * vertically center the Dialog in the window
     */
    centered?: boolean;
    /**
     * Callback function for close modal
     */
    onClose: () => void;
}

export const Modal: FC<IModal> = ({
    className,
    show,
    size,
    centered,
    children,
    onClose,
    ...restProps
}) => {
    return (
        <Portal>
            <>
                <StyledBackdrop className="modal-backdrop" $show={show} />
                <StyledModal
                    $show={show}
                    $size={size}
                    $centered={centered}
                    className={className}
                    onClick={onClose}
                    {...restProps}
                >
                    <CSSTransition
                        in={show}
                        timeout={400}
                        unmountOnExit
                        classNames="modal"
                    >
                        {() => (
                            <div className="modal-dialog">
                                <div
                                    className="modal-content"
                                    onClick={(e) => e.stopPropagation()}
                                    role="button"
                                    tabIndex={0}
                                >
                                    {children}
                                </div>
                            </div>
                        )}
                    </CSSTransition>
                </StyledModal>
            </>
        </Portal>
    );
};

Modal.defaultProps = {
    size: "md",
    centered: true,
};

export const ModalHeader: FC<IProps> = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <StyledHeader
            className={`${className} modal-header`}
            {...restProps}
        >
            {children}
        </StyledHeader>
    );
};

export const ModalTitle: FC<IProps> = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <StyledTitle
            className={`${className} modal-title`}
            {...restProps}
        >
            {children}
        </StyledTitle>
    );
};

interface IClose extends IProps {
    onClose?: () => void;
}

export const ModalClose: FC<IClose> = ({
    className,
    children,
    onClose,
    ...restProps
}) => {
    return (
        <StyledClose
            type="button"
            className={`${className} close`}
            onClick={onClose}
            {...restProps}
            data-dismiss="modal"
            aria-label="Close"
        >
            <span aria-hidden="true">{children}</span>
        </StyledClose>
    );
};

ModalClose.displayName = "ModalClose";

interface IBody extends IProps {}

export const ModalBody: FC<IBody & { bg?: string }> = ({
    className,
    children,
    bg,
    ...restProps
}) => {
    return (
        <StyledBody
            className={`${className} modal-body`}
            bg={bg}
            {...restProps}
        >
            {children}
        </StyledBody>
    );
};

export const ModalFooter: FC<IProps & { bg?: string }> = ({
    className,
    children,
    bg,
    ...restProps
}) => {
    return (
        <StyledFooter
            className={`${className} modal-body`}
            // bg={bg}
            {...restProps}
        >
            {children}
        </StyledFooter>
    );
};
