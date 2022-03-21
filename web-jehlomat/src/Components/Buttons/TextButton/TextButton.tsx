import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { white } from '../../../utils/colors';
import Typography from '@mui/material/Typography/Typography';

interface ITextButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: String;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    underline?: boolean;
}

const Button = styled.button`
    border: none;
    box-shadow: none;
    background: transparent;
    cursor: pointer;
    line-height: 19px;
    text-align: center;
    margin-bottom: 10px;
`;

const TextButton: FC<ITextButton> = ({ text, fontSize, fontWeight, color, underline, ...props }) => {
    return (
        <Button {...props}>
            <Typography
                sx={{
                    fontSize: `${fontSize ? fontSize : '16px'}`,
                    fontWeight: `${fontWeight ? fontWeight : 'bold'}`,
                    color: `${color ? color : `${white}`}`,
                    lineHeight: '18px',
                    textDecoration: `${underline ? 'underline' : 'none'}`,
                }}
            >
                {text}
            </Typography>
        </Button>
    );
};

export default TextButton;
