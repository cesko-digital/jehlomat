import styled from '@emotion/styled';
import { Box } from '@mui/system';
import { Header } from 'Components/Header/Header';
import { FC } from 'react';
import { IData } from '../use-organisation';
import { Field } from './Field';

interface IProps {
    data: IData;
    onEditClick: () => void;
}

const PAGE_TITLE = 'Profil organizace';

const Wrapper = styled(Box)`
    padding: 30px 12px;
`;

export const MobileContent: FC<IProps> = ({ onEditClick, data }) => {
    return (
        <>
            <Header mobileTitle={PAGE_TITLE} />
            <Wrapper>
                <Field value={data.user.email} label={data.organisation.name} onEditClick={onEditClick} />
            </Wrapper>
        </>
    );
};
