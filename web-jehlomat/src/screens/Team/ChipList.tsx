import { Label } from 'Components/Inputs/shared';
import { FC } from 'react';
import styled from '@emotion/styled';
import {Stack} from '@mui/material'
import { size } from 'utils/spacing';
import { white } from 'utils/colors';

interface Props {
    children?: any;
    label?: string;
}

const Container = styled.div`
    width: 100%;
    position: relative;
`;

const ChipWrapper = styled(Stack)`
    label {
        margin-bottom: ${size(2)};
        display: block;
        color: ${white};
    }
`
const ChipLabel = styled(Label)`
    color: ${white}
`


const ChipList: FC<Props> = props => {
    return (
        <Container>
            <ChipLabel>{props.label}</ChipLabel>
            <ChipWrapper direction="row">{props.children}</ChipWrapper>
        </Container>
    );
};

export default ChipList;
