import styled from "styled-components";
import { CardBody, CardFooter } from "../../components/common/card/card";

export const ModuleFlip = styled.div`
  .flip-inner {
    position: relative;
    width: 100%;
    transform-style: preserve-3d;
  }

  .flipped {
    position: absolute;
    top: 0;
    transform: rotateX(180deg);
  }

  .flip {
    width: 100%;
    backface-visibility: hidden;
    transition: transform 0.8s;
  }
`;

export const ModuleWrapper = styled.div<{
  $height?: number;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: ${(props) => props.theme.colors.backgroundVariant200};
  color: ${(props) => props.theme.colors.primary};
  border: 2px solid ${(props) => props.theme.colors.background};
  box-shadow: 0px 0px 0px 1px rgba(121, 131, 162, 0.2);
  border-radius: 5px;

  height: ${({ $height }) => ($height ? `${String($height)}px` : "auto")};

  .adjust-height-handle {
    width: calc(100% + 6px);
    position: absolute;
    left: -3px;
    height: 15px;
    bottom: -18px;
    border: none;
    cursor: row-resize;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ModuleHeader = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundVariant300};
  color: ${(props) => props.theme.colors.primaryVariant100};
  background-blend-mode: soft-light;
  padding: 4.5px 0 4.5px 15px;
  border-bottom: 1.2px solid ${(props) => props.theme.colors.background};
  .wrap {
    height: inherit;
    width: 100%;
    display: block;
  }

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tooltip {
    align-self: center;
  }

  .button {
    stroke: ${({ theme }) => theme.colors.primaryVariant100};
    cursor: pointer;
    margin: 0 6px;
    width: 13.5px;
    height: 30px;
    align-self: center;
    display: flex;
    align-items: center;
  }
  .info {
    fill: ${({ theme }) => theme.colors.primaryVariant100};
  }

  .searchTags {
    padding-left: 6px;
  }

  .pad {
    padding: 9px 0;
  }
`;

export const ModuleFooter = styled(({ ...rest }) => <CardFooter {...rest} />)`
  color: ${({ theme }) => theme.colors.primaryVariant100};
  border-top: 0.8px solid ${({ theme }) => theme.colors.btnRingVariant500};

  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ModuleBody = styled(({ ...rest }) => <CardBody {...rest} />)`
  padding: 0;

  .searchTags {
    margin: 10px;
  }
  .searchTags .close:hover * {
    stroke: ${({ theme }) => theme.colors.secondaryOrange100};
  }
  .searchTags .persisted * {
    color: ${({ theme }) => theme.colors.secondaryOrange50};
    opacity: 0.9;
  }
  .settings {
    padding: 15px;
    height: inherit;
  }
  .setting-title {
    margin-bottom: 10px;
  }
`;
export const ModuleTitle = styled.h6`
  display: inline-flex;
  align-self: center;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primaryVariant100};
  margin: 0;
`;
