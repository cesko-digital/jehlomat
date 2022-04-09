import React, { FunctionComponent } from 'react';
import { LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

const Progress = styled(LinearProgress)({
    backgroundColor: 'rgba(14, 118, 108, 0.2)',
    borderRadius: 4,

    '& .MuiLinearProgress-bar': {
        backgroundColor: 'rgba(14, 118, 108, 1)',
    },
});

const LoadingState: FunctionComponent = () => (
    <tr>
        <td colSpan={8}>
            <Progress />
        </td>
    </tr>
);

export default LoadingState;
