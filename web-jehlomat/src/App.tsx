import React, { FC } from 'react';
import { Box } from '@mui/material';

const App: FC = ({ children }) => {
    return <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>{children}</Box>;
};

export default App;
