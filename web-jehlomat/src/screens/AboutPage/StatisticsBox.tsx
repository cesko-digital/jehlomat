import { Box, useMediaQuery } from '@mui/material';
import { FC } from 'react';
import * as S from './styles';
import { STATISTICS } from './text';
import UserTreeIcon from '../../assets/icons/users-tree.svg';
import UserIcon from '../../assets/icons/person-outline.svg';
import SyringeIcon from '../../assets/icons/strikacka.svg';
import { media } from 'utils/media';

interface StatistictsIconProps {
    type: 'user' | 'users' | 'syringe';
}

export const StatisticsBox = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    return (
        <S.StatisticsBox isMobile={isMobile}>
            {STATISTICS.map(({ icon, text, number }, i) => (
                <S.StaticticsItem key={i} isMobile={isMobile}>
                    <S.IconBox>
                        <StatisticsIcon type={icon} />
                    </S.IconBox>
                    <S.StatisticsInfo>
                        <Box>{number}</Box>
                        <Box>{text}</Box>
                    </S.StatisticsInfo>
                </S.StaticticsItem>
            ))}
        </S.StatisticsBox>
    );
};

const StatisticsIcon: FC<StatistictsIconProps> = ({ type }) => {
    const alt = `Icon of ${type}`;
    let src = UserTreeIcon;
    let height = 32;

    if (type === 'syringe') {
        src = SyringeIcon;
        height = 40;
    } else if (type === 'user') {
        src = UserIcon;
        height = 23;
    }

    return <img src={src} height={height} alt={alt} />;
};
