import styled from '@emotion/styled';
import { primary, white, grey } from 'utils/colors';
import { fontFamilyRoboto } from 'utils/typography';

export const StyledColorfulSectionHeader = styled.div`
    padding: 3rem;
    ${fontFamilyRoboto};
    background-color: ${primary};
    color: ${white};
    font-weight: 300;
    font-size: 48px;
    line-height: 56px;
`;

export const StyledColorfulSection = styled.div`
    padding: 4rem 2.5rem;
    display: flex;
    align-items: center;

    &:nth-of-type(1) {
        background: rgba(47, 166, 154, 0.32);
    }

    &:nth-of-type(2) {
        background: rgba(47, 166, 154, 0.26);
    }

    &:nth-of-type(3) {
        background: rgba(47, 166, 154, 0.2);
    }

    &:nth-of-type(4) {
        background: rgba(47, 166, 154, 0.14);
    }

    &:nth-of-type(5) {
        background: rgba(47, 166, 154, 0.1);
    }
`;

export const StyledColorfulNumber = styled.div`
    background: ${white};
    border: 3px solid ${primary};
    box-sizing: border-box;
    font-size: 36px;
    color: ${primary};
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
`;

export const StyledColorfulTitle = styled.h4`
    ${fontFamilyRoboto};
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 32px;
    /* identical to box height, or 160% */
    letter-spacing: 1.25px;
    text-transform: uppercase;
    color: #0e766c;
    margin: 0;
`;

export const StyledColorfulContent = styled.div`
    padding-left: 2.5rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

export const StyledColorfulDescription = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    color: ${grey};
    margin-top: 1rem;
`;
