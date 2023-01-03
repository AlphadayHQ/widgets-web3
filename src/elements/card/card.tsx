import { FC } from "react";
import {
  StyledCard,
  StyledCardImage,
  StyledCardBody,
  StyledCardHeading,
  StyledCardText,
  StyledCardSubtitle,
  StyledCardLink,
  StyledCardHeader,
  StyledCardFooter,
  StyledCardImgOverlay,
  StyledCardGroup,
  StyledCardDeck,
  StyledCardColumns,
} from "./style";

interface ICardCommonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Card Component
 */

export interface ICardProps {
  className?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  noBorder?: "left" | "right";
  id?: string;
  children?: React.ReactNode;
}

export const Card: FC<ICardProps> = ({
  children,
  className,
  color,
  noBorder,
  id,
  ...restProps
}) => {
  return (
    <StyledCard
      id={id}
      className={className}
      {...restProps}
      $color={color}
      $noBorder={noBorder}
    >
      {children}
    </StyledCard>
  );
};

interface ICardImageProps {
  src: string;
  alt?: string;
  className?: string;
  isTop?: boolean;
  isBottom?: boolean;
}

/**
 * Card Image Component
 */

export const CardImage: FC<ICardImageProps> = ({
  src,
  alt,
  className,
  isTop,
  isBottom,
  ...restProps
}) => {
  const topClass = isTop ? "card-img-top" : "";
  const bottomClass = isBottom ? "card-img-bottom" : "";
  return (
    <StyledCardImage
      src={src}
      alt={alt}
      className={`card-image ${topClass} ${bottomClass}`}
      $isTop={isTop}
      $isBottom={isBottom}
      {...restProps}
    />
  );
};

/**
 * Card Body Component
 */

interface ICardBodyProps extends ICardCommonProps {
  collapse?: boolean;
}

export const CardBody: FC<ICardBodyProps> = ({
  children,
  className,
  collapse,
  ...restProps
}) => {
  return (
    <StyledCardBody className="card-body" collapse={collapse} {...restProps}>
      {children}
    </StyledCardBody>
  );
};

/**
 * Card Title Component
 */

interface ICardTitleProps {
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children?: React.ReactNode;
}

export const CardTitle: FC<ICardTitleProps> = ({
  children,
  className,
  as,
  ...restProps
}) => {
  return (
    <StyledCardHeading as={as} className="card-title" {...restProps}>
      {children}
    </StyledCardHeading>
  );
};

/**
 * Card Text Component
 */

export const CardText: FC<ICardCommonProps> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <StyledCardText className="card-text" {...restProps}>
      {children}
    </StyledCardText>
  );
};

/**
 * Card Subtitle Component
 */

export const CardSubtitle: FC<ICardCommonProps> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <StyledCardSubtitle className="card-subtitle" {...restProps}>
      {children}
    </StyledCardSubtitle>
  );
};

/**
 * Card Link Component
 */

interface ICardLinkProps {
  className?: string;
  path: string;
  children?: React.ReactNode;
}

export const CardLink: FC<ICardLinkProps> = ({
  children,
  className,
  path,
  ...restProps
}) => {
  return (
    <StyledCardLink path={path} className="card-link" {...restProps}>
      {children}
    </StyledCardLink>
  );
};

/**
 * Card Header Component
 */

interface ICardHeaderProps extends ICardCommonProps {
  variant?: "flexbcenter";
}

export const CardHeader: FC<ICardHeaderProps> = ({
  children,
  className,
  variant,
  ...restProps
}) => {
  return (
    <StyledCardHeader className="card-header" $variant={variant} {...restProps}>
      {children}
    </StyledCardHeader>
  );
};

/**
 * Card Footer Component
 */

interface ICardFooterProps extends ICardCommonProps {}

export const CardFooter: FC<ICardFooterProps> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <StyledCardFooter className="card-footer" {...restProps}>
      {children}
    </StyledCardFooter>
  );
};

/**
 * Card Image Overlay Component
 */

export const CardImageOverlay: FC<ICardCommonProps> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <StyledCardImgOverlay className="card-img-overlay" {...restProps}>
      {children}
    </StyledCardImgOverlay>
  );
};

/**
 * Card Group Component
 */

export const CardGroup: FC<ICardCommonProps> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <StyledCardGroup className="card-group" {...restProps}>
      {children}
    </StyledCardGroup>
  );
};

/**
 * Card Deck Component
 */

export const CardDeck: FC<ICardCommonProps> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <StyledCardDeck className="card-deck" {...restProps}>
      {children}
    </StyledCardDeck>
  );
};

export const CardColumns: FC<ICardCommonProps> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <StyledCardColumns className="card-columns" {...restProps}>
      {children}
    </StyledCardColumns>
  );
};
