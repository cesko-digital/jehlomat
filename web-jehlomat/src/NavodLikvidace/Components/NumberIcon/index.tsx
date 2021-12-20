import { INumberIcon } from './types';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import { primaryDark } from '../../../Components/Utils/Colors';

const Number = styled.span`
    font-size: 36px;
    font-family: Roboto;
    font-weight: 400;
    line-height: 42px;
    color: ${primaryDark};
`;

export const NumberIcon: React.FunctionComponent<INumberIcon> = ({ number }) => {
    return (
        <Box
            sx={{
                width: '56px',
                height: '56px',
                backgroundColor: 'white',
                borderRadius: '100%',
                border: `3px solid ${primaryDark}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
            }}
        >
            <Number>{number}</Number>
        </Box>
    );
};

export default NumberIcon;
