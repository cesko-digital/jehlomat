import Navigation from '../Navigation/Navigation';
import { FC } from 'react';
import { useMediaQuery } from '@mui/material';
import { media } from '../../utils/media';
import { useRecoilValue } from 'recoil';
import { isLoginValidState } from 'store/login';

interface Props {}

const Layout: FC<Props> = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const isLoggedIn = useRecoilValue(isLoginValidState);

    if (isMobile && isLoggedIn) {
        return <Navigation />;
    }

    return null;
};

export default Layout;
