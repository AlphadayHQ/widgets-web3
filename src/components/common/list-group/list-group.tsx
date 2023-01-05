import { Children, FC, ReactChild, ReactText, FunctionComponent } from "react";
import { StyledListGroup, StyledListGroupItem } from "./style";

interface IProps {
    as?: React.ElementType;
    className?: string;
    children?: React.ReactNode;
}

interface IListGroup extends IProps {
    flush?: boolean;
    horizontal?: boolean;
}

type IChild = Exclude<ReactChild, ReactText>;

export const ListGroup: FC<IListGroup> = ({
    as,
    className,
    children,
    flush,
    horizontal,
    ...restProps
}) => {
    const RenderChild = Children.map(children, (el) => {
        const child = el as IChild;
        if (child !== null) {
            const childType = child.type as FunctionComponent;
            const name = childType.displayName || childType.name;
            if (name === "ListGroupItem") {
                return (
                    <child.type
                        {...child.props}
                        flush={flush}
                        horizontal={horizontal}
                    />
                );
            }
        }
        return child;
    });
    return (
        <StyledListGroup
            as={as}
            className={`${className} list-group`}
            $horizontal={horizontal}
            {...restProps}
        >
            {RenderChild}
        </StyledListGroup>
    );
};

export interface IListGroupItem
    extends IProps {
    active?: boolean;
    disabled?: boolean;
    action?: boolean;
    href?: string;
    flush?: boolean;
    horizontal?: boolean;
    $borderColor?: string;
}

export const ListGroupItem: FC<IListGroupItem> = ({
    as,
    className,
    children,
    active,
    disabled,
    action,
    href,
    flush,
    horizontal,
    $borderColor,
    ...restProps
}) => {
    return (
        <StyledListGroupItem
            as={as}
            className={`${className} list-group-item`}
            $active={active}
            $disabled={disabled}
            $action={action}
            href={href}
            $flush={flush}
            $horizontal={horizontal}
            $borderColor={$borderColor}
            {...restProps}
        >
            {children}
        </StyledListGroupItem>
    );
};

ListGroupItem.displayName = "ListGroupItem";
