/* eslint-disable jsx-a11y/heading-has-content */
import styled, { themeGet, css, device } from "../../../styles";

export const StyledCard = styled(({ ...props }) => <div {...props} />)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid ${themeGet("colors.border")};
  border-radius: ${themeGet("radii.rounded")};
  ${(props) =>
    props.theme.name === "dark" &&
    css`
      border-width: 0;
      background-color: ${themeGet("colors.gray900")};
      color: ${themeGet("colors.gray500")};
    `}
`;

export const StyledCardImage = styled(({ ...props }) => (
  <img {...props} alt="card " />
))`
  flex-shrink: 0;
  width: 100%;
  border-radius: ${themeGet("radii.rounded")};
  display: block;
  ${(props) =>
    props.$isTop === true &&
    css`
      border-top-left-radius: ${themeGet("radii.rounded")};
      border-top-right-radius: ${themeGet("radii.rounded")};
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `}
  ${(props) =>
    props.$isBottom === true &&
    css`
      border-bottom-left-radius: ${themeGet("radii.rounded")};
      border-bottom-right-radius: ${themeGet("radii.rounded")};
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `}
`;

interface IBodyProps {}

export const StyledCardBody = styled(({ position, ...props }) => (
  <div {...props} />
))<IBodyProps>`
  flex: 1 1 auto;
  min-height: 1px;
  padding: 15px;
  ${device.small} {
    padding: 20px;
  }
`;

export const StyledCardHeading = styled(({ ...props }) => <h2 {...props} />)`
  margin-bottom: 0.75rem;
`;

export const StyledCardText = styled(({ ...props }) => <p {...props} />)``;

export const StyledCardSubtitle = styled(({ ...props }) => <h6 {...props} />)`
  margin-top: -0.375rem;
  margin-bottom: 0.5rem;
  color: ${themeGet("colors.gray600")};
`;

export const StyledCardLink = styled(({ ...props }) => <a {...props} />)`
  color: ${themeGet("colors.primary")};
  &:not(:first-of-type) {
    margin-left: 1.25rem;
  }
`;

interface ICardHeaderProps {
  $variant?: "flexbcenter";
}

export const StyledCardHeader = styled(({ ...props }) => (
  <header {...props} />
))<ICardHeaderProps>`
  margin-bottom: 0;
  border-bottom: 1px solid ${themeGet("colors.border")};
  background-color: transparent;
  padding: 15px;
  font-weight: 500;
  ${device.small} {
    padding: 15px 20px;
  }
  &:first-of-type {
    border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
  }
  ${({ $variant }) =>
    $variant === "flexbcenter" &&
    css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `}
`;

interface IFooterProps {}

export const StyledCardFooter = styled(({ ...props }) => (
  <footer {...props} />
))<IFooterProps>`
  border-top: 1px solid ${themeGet("colors.border")};
  background-color: transparent;
  padding: 0.75rem 1.25rem;
  &:last-of-type {
    border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px);
  }
`;

export const StyledCardImgOverlay = styled(({ ...props }) => (
  <div {...props} />
))`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1.25rem;
`;

export const StyledCardGroup = styled(({ ...props }) => <div {...props} />)`
  ${device.small} {
    display: flex;
    flex-flow: row wrap;
    & > .card {
      flex: 1 0 0%;
      margin-bottom: 0;
    }
    & > .card:not(:last-of-type) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    & > .card:not(:first-of-type) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: 0;
      border-left: 0;
    }
    & > .card:not(:last-of-type) .card-img-top,
    & > .card:not(:last-of-type) .card-header {
      border-top-right-radius: 0;
    }
    & > .card:not(:first-of-type) .card-img-top,
    & > .card:not(:first-of-type) .card-header {
      border-top-left-radius: 0;
    }
  }
`;

export const StyledCardDeck = styled(({ ...props }) => <div {...props} />)`
  ${device.small} {
    display: flex;
    flex-flow: row wrap;
    margin-right: -15px;
    margin-left: -15px;
    & > .card {
      flex: 1 0 0%;
      margin-right: 15px;
      margin-bottom: 0;
      margin-left: 15px;
    }
  }
`;

export const StyledCardColumns = styled(({ ...props }) => <div {...props} />)`
  ${device.small} {
    column-count: 3;
    column-gap: 1.25rem;
    orphans: 1;
    widows: 1;
    & > .card {
      display: inline-block;
      width: 100%;
    }
  }

  & > .card {
    margin-bottom: 0.75rem;
  }
`;
