import { Grid } from '@mui/material';
import { Header } from 'Components/Header/Header';
import { FC } from 'react';
import { IData } from '../use-organisation';
import { Detail } from './Detail';
import * as S from './styles';

interface IProps {
    data: IData;
    onEditClick: () => void;
}

const PAGE_TITLE = 'Profil organizace';

export const DesktopContent: FC<IProps> = ({ data, onEditClick }) => {
    return (
        <>
            <Header mobileTitle="" />
            <S.Container>
                <S.Title variant="h1">{PAGE_TITLE}</S.Title>
                <Grid container columnSpacing={10} mb={8}>
                    <Grid item xs={6}>
                        <Detail onEditClick={onEditClick} data={data} />
                    </Grid>
                    <Grid item xs={6}>
                        {/* Place for the map */}
                    </Grid>
                </Grid>
            </S.Container>
        </>
    );
};
