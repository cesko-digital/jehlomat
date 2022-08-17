import styled from '@emotion/styled';
import { primary, primaryDark, secondary, white, grey } from 'utils/colors';
import { fontFamilyRoboto } from 'utils/typography';
import { media } from 'utils/media';

export const NavodyContainer = styled.div`
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    max-width: 900px;

    @media ${media.gt('mobile')} {
        margin: 6rem auto;
        padding: 0 2rem;
    }
`;

export const NavodyHeader = styled.div`
    padding: 5rem 3rem;
    ${fontFamilyRoboto};
    background-color: ${primary};
    color: ${white};
    font-weight: 300;
    font-size: 48px;
    line-height: 56px;

    @media ${media.lte('mobile')} {
        display: none;
    }
`;

export const NavodySection = styled.div`
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

    @media ${media.lte('mobile')} {
        flex-direction: column;
        padding: 1rem 2rem 2rem;
    }
`;

export const NavodySectionNoBackground = styled(NavodySection)`
    background: none !important;
`;

export const NavodyNumber = styled.div`
    background: ${white};
    border: 3px solid ${primaryDark};
    box-sizing: border-box;
    font-size: 36px;
    color: ${primaryDark};
    width: 56px;
    height: 56px;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
`;

export const NavodyTitle = styled.h4`
    ${fontFamilyRoboto};
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 32px;
    /* identical to box height, or 160% */
    letter-spacing: 1.25px;
    text-transform: uppercase;
    color: ${primaryDark};
    margin: 0;

    @media ${media.lte('mobile')} {
        text-transform: none;
        text-align: center;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 19px;
        margin-top: 10px;
        max-width: 250px;
    }
`;

export const NavodyContent = styled.div`
    padding-left: 2.5rem;
    display: flex;
    justify-content: center;
    flex-direction: column;

    @media ${media.lte('mobile')} {
        padding: 0;
        align-items: center;
    }
`;

export const NavodyDescription = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    color: ${grey};
    margin-top: 0.5rem;
    margin-bottom: 0;

    @media ${media.lte('mobile')} {
        font-size: 14px;
        text-align: center;
        max-width: 350px;
    }
`;

export const NavodyDescriptionLink = styled.a`
    color: ${secondary};
`;
