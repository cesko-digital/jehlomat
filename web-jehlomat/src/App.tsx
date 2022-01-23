import React, { FC } from 'react';
import { Box } from '@mui/material';
import T from './t';
// import { Footer } from './components/Footer/Footer';

const App: FC = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {children}
            <T />
            {/* <Footer /> */}
        </Box>
    );
};

export default App;
