import { INumberIcon } from './types';
import Box from '@mui/material/Box';
import styled from '@emotion/styled';
import { primaryDark } from '../../../../utils/colors';

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
            width={56}
            height={56}
            minWidth={56}
            minHeight={56}
            bgcolor="white"
            borderRadius={56}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
                border: `3px solid ${primaryDark}`,
            }}
        >
            <Number>{number}</Number>
        </Box>
    );
};

export default NumberIcon;
