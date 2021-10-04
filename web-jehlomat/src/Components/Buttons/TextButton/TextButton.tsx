import { ButtonHTMLAttributes, FC } from "react";
import styled from "styled-components";
import { primaryDark } from "../../Utils/Colors";
import { H4 } from "../../Utils/Typography";

interface ITextButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: String;
}

const Button = styled.button`
  height: 48px;
  border: none;
  box-shadow: none;
  background: transparent;
  color: ${primaryDark};
  cursor: pointer;
  padding: 0px 20px;
`;

const TextButton: FC<ITextButton> = ({ text, ...props }) => {
  return (
    <Button {...props}>
      <H4>{text}</H4>
    </Button>
  );
};

export default TextButton;
