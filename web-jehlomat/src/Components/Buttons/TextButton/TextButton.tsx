import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { white } from '../../../utils/colors';
import Typography from '@mui/material/Typography/Typography';

interface ITextButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: String;
    fontSize?: string;
}

const Button = styled.button`
    border: none;
    box-shadow: none;
    background: transparent;
    color: ${white};
    cursor: pointer;
    line-height: 19px;
    text-align: center;
    margin-bottom: 10px;
`;

const TextButton: FC<ITextButton> = ({ text, fontSize, ...props }) => {
    return (
        <Button {...props}>
            <Typography sx={{ fontSize: `${fontSize ? fontSize : '16px'}`, fontWeight: 'bold', lineHeight: '18px' }}>{text}</Typography>
        </Button>
    );
};

export default TextButton;
