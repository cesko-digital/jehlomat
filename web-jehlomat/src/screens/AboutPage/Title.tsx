import * as S from './styles';
import * as TEXT from './text';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';

export const Title = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    return (
        <S.Title isMobile={isMobile} variant="h1">
            {TEXT.PAGE_TITLE}
        </S.Title>
    );
};
