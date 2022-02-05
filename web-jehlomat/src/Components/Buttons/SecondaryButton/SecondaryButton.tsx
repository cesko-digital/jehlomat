import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { primaryDark, white } from '../../../utils/colors';
import { H4 } from '../../../utils/typography';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
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
  
    a {
        text-decoration: none;
        color: inherit;
    }
`;

const SecondaryButton: FC<Props> = ({ text, children, ...props }) => {
    return (
        <Button {...props}>
            <H4>{text || children}</H4>
        </Button>
    );
};

export default SecondaryButton;
