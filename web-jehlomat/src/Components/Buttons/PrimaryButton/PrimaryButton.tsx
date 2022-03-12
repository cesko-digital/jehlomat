import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { primaryDark, white } from '../../../utils/colors';
import { Typography } from '@mui/material';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: String;
    fontSize?: string;
}

const Button = styled.button`
    // height: 50px;
    border: none;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 36px;
    background-color: ${primaryDark};
    color: ${white};
    cursor: pointer;
    padding: 15px 30px;
`;

const PrimaryButton: FC<Props> = ({ text, fontSize, ...props }) => {
    return (
        <Button {...props}>
            <Typography variant="button" sx={{ fontSize: `${fontSize ? fontSize : '20px'}`, lineHeight: '16px', fontWeight: '400' }}>
                {text}
            </Typography>
        </Button>
    );
};

export default PrimaryButton;
