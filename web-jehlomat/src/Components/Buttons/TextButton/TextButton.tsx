import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { white } from '../../../utils/colors';
import Typography, { TypographyProps } from '@mui/material/Typography/Typography';

interface ITextButton extends ButtonHTMLAttributes<HTMLButtonElement>, Pick<TypographyProps, 'fontSize' | 'textTransform'> {
    text: string;
    textDecoration?: string;
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

const TextButton: FC<ITextButton> = ({ text, color, fontSize,textTransform, textDecoration, ...props }) => {
    return (
        <Button {...props}>
            <Typography
                {...{fontSize, textTransform}}
                sx={{ fontWeight: 500, lineHeight: '18px', color, textDecoration }}>{text}</Typography>
        </Button>
    );
};

export default TextButton;
