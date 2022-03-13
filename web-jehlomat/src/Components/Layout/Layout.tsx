import Navigation from '../Navigation/Navigation';
import { FC } from 'react';
import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import { media } from '../../utils/media';
import { useLogin } from 'utils/login';

interface Props {}

const Layout: FC<Props> = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    let { token } = useLogin();

    if (isMobile && token) {
        return (
            <>
                <Navigation /> <Box py={8} />
            </>
        );
    }

    return null;
};

export default Layout;
