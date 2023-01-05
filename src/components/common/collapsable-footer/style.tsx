import styled from "../../../styles";

export const StyledBottom = styled.p<{ showAll: boolean }>`
  border-top: 1px solid ${({ theme }) => theme.colors.btnRingVariant500};
  padding-top: 7px;
  width: 100%;
  text-align: center;

  svg {
    color: ${({ theme }) => theme.colors.primaryVariant800};
    transform: ${({ showAll }) => (showAll ? "rotate(180deg)" : "")};
  }
`;

export const StyledWrap = styled.span`
  cursor: pointer;
`;
