import { FC, InputHTMLAttributes } from "react";
import styled from "styled-components";
import {primaryDark} from '../../Utils/Colors';

interface TextInput extends InputHTMLAttributes<HTMLInputElement> {}

const Input = styled.input `
  height: 64px;
  width: 100%;
  max-width: 340px;
  padding: 0px 15px;
  
  border: 1px solid ${primaryDark};
  box-sizing: border-box;
  border-radius: 10px;

  :focus {
    outline: none;
  }
`

const TextInput: FC<TextInput> = (props) => {
  return <Input {...props}/>;
};

export default TextInput;