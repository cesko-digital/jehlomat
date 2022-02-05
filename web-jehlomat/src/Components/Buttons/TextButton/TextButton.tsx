import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { primaryDark, primaryLight, white } from '../../../utils/colors';
import { H4 } from '../../../utils/typography';
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

const TextButton: FC<ITextButton> = ({ text, ...props }) => {
    return (
        <Button {...props}>
            <Typography sx={{ fontWeight: 'bold', lineHeight: '18px' }}>{text}</Typography>
        </Button>
    );
};

export default TextButton;
