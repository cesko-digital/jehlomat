import styled, {createGlobalStyle} from "styled-components";

export const Container = styled("div")<{mobile?: boolean}>`
  align-self: center;
  ${props => !props.mobile && `
    border-right: 1px solid #fff;`}
  ${props => props.mobile && `
    max-width: 6em;`}
  padding: 5px 15px;
  font-size: 1em;
  line-height: 16px;
  letter-spacing: 1.25px;
  &:last-child {
    border-right: none;
  }
`

export const Link = styled("div")<{mobile?: boolean}>`
    align-content: center;
    ${props => !props.mobile && `
    text-transform: uppercase;
    text-align: right;`}
    
`


/*
export const Link2 = styled.div(props => ({
    alignContent: "center",
    textAlign: "right",
    textTransform: props.transform
}));*/
