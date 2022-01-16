import { ButtonHTMLAttributes, FC } from "react"
import styled from "@emotion/styled"
import { primaryDark } from "utils/colors"
import { H4 } from "utils/typography"

interface ITextButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: String
}

const Button = styled.button`
  height: 48px;
  border: none;
  box-shadow: none;
  background: transparent;
  color: ${primaryDark};
  cursor: pointer;
  padding: 0px 20px;
`

const TextButton: FC<ITextButton> = ({ text, ...props }) => {
  return (
    <Button {...props}>
      <H4>{text}</H4>
    </Button>
  )
}

export default TextButton
