import * as S from './styles';
import LogoMagdalena from '../../assets/logo/logo-magdalena-black.svg';
import LogoCeskoDigital from '../../assets/logo/logo-cesko-digital.svg';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
export const Footer = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    return (
        <S.Footer isMobile={isMobile}>
            <img style={{ marginRight: '54px' }} src={LogoMagdalena} alt="Logo Magdalena" height={50} />
            <img src={LogoCeskoDigital} alt="Logo Cesko Digital" height={30} />
        </S.Footer>
    );
};
