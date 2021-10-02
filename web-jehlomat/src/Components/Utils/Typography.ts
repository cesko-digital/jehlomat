import styled from "styled-components";

export const fontFamilyRoboto = "font-family: Roboto;";

export const fontWeightBold = "font-weight: bold;";
export const fontWeight700 = "font-weight: 700;";
export const fontWeight500 = "font-weight: 500;";

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
export const FormItemLabel = styled.span`
  font-size: 16px;
  letter-spacing: 1.25px;
  text-transform: uppercase;
  color: black;
`;
