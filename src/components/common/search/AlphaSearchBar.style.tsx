import styled from "../../../styles";

export const StyledCustomPlaceholder = styled.span`
    color: ${({ theme }) => theme.colors.primaryVariant100};
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    width: 100%;
`;

export const StyledSearchContainer = styled.div`
    max-width: 524px;
    width: 100%;
    height: 41px;
    color: ${({ theme }) => theme.colors.primary};
`;

export const StyledEmptyResultsContainer = styled.div`
    display: flex;
    width: 100%;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
    max-width: 524px;
    align-items: center;
    justify-content: center;
`;
