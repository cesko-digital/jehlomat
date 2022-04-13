import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { FC } from 'react';
import { IData } from '../use-organisation';
import { Field } from './Field';

interface IProps {
    data: IData;
    onEditClick: () => void;
}

const Wrapper = styled(Box)`
    & > *:not(:last-child) {
        margin-bottom: 24px;
    }
`;

export const Detail: FC<IProps> = ({ onEditClick, data }) => {
    return (
        <Wrapper>
            <Field label="Jméno organizace" value={data.organisation.name} onEditClick={onEditClick} />
            <Field label="E-mail organizace" value={data.user.email} onEditClick={onEditClick} />
        </Wrapper>
    );
};
