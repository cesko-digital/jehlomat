import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { white } from '../../../utils/colors';
import Typography from '@mui/material/Typography/Typography';

interface ITextButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: String;
}

const Button = styled.button`
    border: none;
    box-shadow: none;
    background: transparent;
    color: ${white};
    cursor: pointer;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    margin-bottom: 10px;
`;

const TextButton: FC<ITextButton> = ({ text, color, ...props }) => {
    return (
        <Button {...props}>
            <Typography sx={{ fontWeight: 'bold', lineHeight: '18px' , color: color }}>{text}</Typography>
        </Button>
    );
};

export default TextButton;
