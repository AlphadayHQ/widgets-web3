/* eslint-disable react/button-has-type */
import { FC } from "react";
import { StyledButton } from "./AlphaButton.style";

export interface ButtonProps {
  variant?:
    | "primaryXL"
    | "secondaryXL"
    | "primary"
    | "secondary"
    | "small"
    | "extraSmall";
  colorVariant?: "default" | "error";
  disabled?: boolean;
  uppercase?: boolean;
  label?: string;
  title?: string;
  extraClassStyles?: string;
  onClick?: () => MaybeAsync<void>;
  children?: React.ReactNode;
}

export const AlphaButton: FC<ButtonProps> = ({
  children,
  variant,
  colorVariant,
  disabled,
  uppercase,
  label,
  extraClassStyles,
  ...restProps
}) => {
  return (
    <StyledButton
      $variant={variant}
      colorVariant={colorVariant}
      disabled={disabled}
      $uppercase={uppercase}
      aria-label={label}
      className={extraClassStyles}
      {...restProps}
    >
      {children}
    </StyledButton>
  );
};

AlphaButton.defaultProps = {
  variant: "primary",
  disabled: false,
  uppercase: true,
  label: "button",
};
