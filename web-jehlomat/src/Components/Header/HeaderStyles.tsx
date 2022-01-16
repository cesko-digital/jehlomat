import styled from "@emotion/styled"
import { primary } from "utils/colors"
import { media } from "utils/media"
import { size } from "utils/spacing"
import { fontFamilyRoboto } from "utils/typography"

export const SContainer = styled.div`
  background-color: ${primary};
  ${fontFamilyRoboto};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;
  height: 80px;
  font-size: 1em;
  line-height: 16px;
  letter-spacing: 1.25px;
  color: white;

  @media ${media.lte("mobile")} {
    display: none;
  }
`

export const SLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 1.5em;
`

export const SMobileContainer = styled.div`
  padding-top: ${size(14)};

  @media ${media.gt("mobile")} {
    display: none;
  }
`
