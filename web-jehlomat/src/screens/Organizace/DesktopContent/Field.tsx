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
    font-size: 16px;
    line-height: 24px;
    color: ${grey};
    margin-bottom: 12px;
`;

const Value = styled(Box)`
    padding: 13px 55px 13px 17px;
    border-radius: 8px;
    border: 1px solid ${greyLight};
    font-size: 16px;
    line-height: 24px;
    position: relative;
`;

const Icon = styled(EditIcon)`
    color: ${primary};
    position: absolute;
    right: 14px;
    top: 0;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%);
`;

export const Field: FC<IProps> = ({ label, value, onEditClick }) => {
    return (
        <Box>
            <Label>{label}</Label>
            <Value>
                {value}
                <Icon onClick={onEditClick} />
            </Value>
        </Box>
    );
};
