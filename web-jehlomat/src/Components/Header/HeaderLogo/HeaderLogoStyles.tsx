import styled from "@emotion/styled"
import { primary } from "utils/colors"

export const Container = styled.div<{ mobile?: boolean }>`
  background-color: ${primary};

  > svg {
    width: ${({ mobile }) => (mobile ? "290px" : "100%")};
    height: 100%;
  }

  ${(props) =>
    !props.mobile &&
    `
    float: left;
    max-height: 40px;
    max-width: 300px;
    padding: 1.5em 2em;
    `}
  ${(props) =>
    props.mobile &&
    `
    width: 100vw;
    max-height: 100%;
    padding: 0;
    float: none;
`}
`
