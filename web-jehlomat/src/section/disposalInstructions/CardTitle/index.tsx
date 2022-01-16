import styled from "@emotion/styled"
import { primaryDark } from "utils/colors"
import { media } from "utils/media"
import { size } from "utils/spacing"
import { ICardTitle } from "./types"

const Title = styled.h6`
  font-size: ${size(4)};
  font-family: Roboto;
  font-weight: 500;
  text-align: center;
  color: ${primaryDark};
  margin: 0;
  padding: 0;

  @media ${media.gt("mobile")} {
    text-align: left;
    font-size: ${size(5)};
    text-transform: uppercase;
  }
`

const CardTitle: React.FunctionComponent<ICardTitle> = ({ text }) => {
  return <Title>{text}</Title>
}

export default CardTitle
