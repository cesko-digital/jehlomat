import React, { FC } from 'react';
import { Box } from '@mui/material';
import { Footer } from './components/Footer/Footer';

const App: FC = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {children}
            <Footer />
        </Box>
    );
};

export default App;
