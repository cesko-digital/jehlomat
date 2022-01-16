import styled from "@emotion/styled"
import { primaryDark } from "utils/colors"
import { media } from "utils/media"
import { fontFamilyRoboto } from "utils/typography"

export const SContainer = styled.div`
  background-color: ${primaryDark};
  ${fontFamilyRoboto};
  display: flex;
  flex-direction: row;
  overflow: hidden;
  width: 100%;
  height: auto;
  padding: 1em 0;

  @media ${media.lte("mobile")} {
    display: none;
  }
`

export const SLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
`
