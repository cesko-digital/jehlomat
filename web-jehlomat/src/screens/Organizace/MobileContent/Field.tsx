import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { FC } from 'react';
import { grey, greyLight, primary } from 'utils/colors';
import EditIcon from '@mui/icons-material/Edit';

interface IProps {
    label: string;
    value: string;
    onEditClick: () => void;
}

const Label = styled(Box)`
    font-size: 14px;
    line-height: 16px;
    font-weight: 700px;
    margin-bottom: 9px;
`;

const Value = styled(Box)`
    font-size: 14px;
    line-height: 16px;
    font-weight: 700px;
    color: ${grey};
`;

const Icon = styled(EditIcon)`
    color: ${primary};
    position: absolute;
    right: 8px;
    top: 0;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%);
`;

const Wrapper = styled(Box)`
    padding: 11px 47px 11px 13px;
    border-radius: 8px;
    border: 1px solid ${greyLight};
    position: relative;
`;

export const Field: FC<IProps> = ({ label, value, onEditClick }) => {
    return (
        <Wrapper>
            <Label>{label}</Label>
            <Value>{value}</Value>
            <Icon onClick={onEditClick} />
        </Wrapper>
    );
};
