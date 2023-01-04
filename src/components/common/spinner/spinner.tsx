import { FC } from "react";
import { StyledSpinner } from "./style";

export interface ISpinnerProps {
  /**
   * Pass extra classes
   */
  className?: string;
  /**
   *  Default is `border`.
   */
  variant?: "border" | "grow";
  /**
   * Default is `text`.
   */
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "white";
  /**
   * Default is `md`.
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const Spinner: FC<ISpinnerProps> = ({
  className,
  variant = "border",
  color,
  size,
  ...restProps
}) => {
  return (
    <StyledSpinner
      className={`${className} spinner spinner-${variant}`}
      $variant={variant}
      $color={color}
      $size={size}
      {...restProps}
    />
  );
};
