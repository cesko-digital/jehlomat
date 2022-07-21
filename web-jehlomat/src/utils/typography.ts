import styled from '@emotion/styled';
import { primaryDark } from './colors';
import { media } from 'utils/media';

export const fontFamilyRoboto = 'font-family: Roboto;';

export const fontWeightBold = 'font-weight: bold;';
export const fontWeight700 = 'font-weight: 700;';
export const fontWeight500 = 'font-weight: 500;';

export const H1 = styled.span`
    ${fontFamilyRoboto}
    ${fontWeightBold}
    font-size: 27px;
    letter-spacing: 1.25px;
    text-transform: uppercase;
`;

export const H2 = styled.span`
    ${fontFamilyRoboto}
    ${fontWeightBold}
    font-size: 24px;
    letter-spacing: 1.25px;
    text-transform: uppercase;
`;

export const H3 = styled.span`
    ${fontFamilyRoboto}
    ${fontWeightBold}
    font-size: 18px;
    letter-spacing: 1.25px;
    text-transform: uppercase;
`;

export const H4 = styled.span`
    ${fontFamilyRoboto}
    ${fontWeightBold}
    font-size: 16px;
    letter-spacing: 1.25px;
    text-transform: uppercase;
`;

export const NavigationTitle = styled.span`
    ${fontFamilyRoboto};
    font-size: 20px;
    line-height: 24px;
    color: white;
`;
export const FormItemLabel = styled.label<{ disableUppercase?: boolean }>`
    font-size: Menlo;
    font-size: 16px;
    letter-spacing: 1.25px;
    text-transform: ${props => (props.disableUppercase ? 'none' : 'uppercase')};
    padding-bottom: 15px;
    color: grey;
    padding-bottom: 5px;

    @media (min-width: 420px) {
        align-self: flex-start;
    }
    @media ${media.lte('mobile')} {
        font-weight: 700;
    }
`;

export const FormHeading = styled.p`
    ${fontFamilyRoboto}
    ${fontWeightBold}
    width: 80%;
    color: black;
    font-size: 15px;
    @media (min-width: 420px) {
        width: 50%;
    }
    @media ${media.gt('mobile')} {
        width: 340px;
    }
`;

export const FormItemDescription = styled.p<{ green?: boolean; sm?: boolean }>`
    ${fontFamilyRoboto}
    width: 75%;
    color: ${props => (props.green ? primaryDark : 'black')};
    font-size: 18px;
    display: flex;
    align-items: baseline;
    justify-content: center;
    text-align: center;
    line-height: 24px;

    @media ${media.lte('mobile')} {
        text-align: left;
        width: 100%;
        font-weight: 500;
        margin: 0 0 3rem;
        font-size: ${props => (props.sm ? '16px' : '18px')};
    }}
`;
