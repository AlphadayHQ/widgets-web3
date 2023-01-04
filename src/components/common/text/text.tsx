import { FC, ElementType } from "react";
import { StyledText } from "./style";

interface IProps {
    as?: ElementType;
    className?: string;
    children?: React.ReactNode;
}

export const Text: FC<IProps> = ({ as, className, children, ...restProps }) => {
    return (
        <StyledText as={as} className={className} {...restProps}>
            {children}
        </StyledText>
    );
};
