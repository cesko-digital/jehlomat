import { FC, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { primaryDark } from '../../Utils/Colors';

interface TextInput extends InputHTMLAttributes<HTMLInputElement> {}

const Input = styled.input`
    height: 64px;
    width: 100%;
    max-width: 340px;
    padding: 0px 15px;

    border: 1px solid ${primaryDark};
    box-sizing: border-box;
    border-radius: 5px;

    :disabled {
        border: 1px solid rgba(0, 0, 0, 0.15);
        background-color: rgba(0, 0, 0, 0.05);
        height: 64px !important;
    }

    :read-only {
        user-select: none;
        height: 48px;
    }
`;

const TextInput: FC<TextInput> = props => {
    return <Input {...props} />;
};

export default TextInput;
