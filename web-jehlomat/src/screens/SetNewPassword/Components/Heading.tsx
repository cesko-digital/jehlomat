import styled from "@emotion/styled";
import {textSubTitles} from "utils/colors";
import {fontFamilyRoboto} from "utils/typography";

const Heading = styled.h2`
    ${fontFamilyRoboto}
    font-weight: 300;
    color: ${textSubTitles};
    font-size: 24px;
    line-height: 28px;
`;

export default Heading;
