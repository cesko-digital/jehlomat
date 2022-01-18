import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { primaryDark, white } from '../../../utils/colors';
import { H4 } from '../../../utils/typography';

interface SecondaryButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: String;
}

const Button = styled.button`
    height: 48px;
    border: none;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 28px;
    background-color: ${white};
    color: ${primaryDark};
    cursor: pointer;
    padding: 0px 20px;
`;

const SecondaryButton: FC<SecondaryButton> = ({ text, ...props }) => {
    return (
        <Button {...props}>
            <H4>{text}</H4>
        </Button>
    );
};

export default SecondaryButton;
