import Navigation from '../Navigation/Navigation';
import { FC } from 'react';
import { useMediaQuery } from '@mui/material';
import { media } from '../../utils/media';

interface Props {}

const Layout: FC<Props> = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    if (isMobile) {
        return <Navigation />;
    }

    return null;
};

export default Layout;
