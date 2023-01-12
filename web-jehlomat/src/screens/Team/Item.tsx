import { Chip } from '@mui/material';
import styled from '@emotion/styled';
import { secondaryColorVariant, white } from 'utils/colors';

const ChipParent = styled.li`
    margin: 0;
    padding: 0.5em;
    text-align: left;
    list-style-type: none;
`;

const ChipLabel = styled.div`
    color: ${secondaryColorVariant('full')};
`;

const TeamChip = styled(Chip)`
    background-color: rgba(255, 255, 255, 0.5);
`;

const Item = (props: { id: string; name: string; remove?: any }) => {
    return (
        <ChipParent>
            <TeamChip label={<ChipLabel>{props.name}</ChipLabel>} {...(props.remove && { onDelete: () => props.remove(props.id) })} {...props} />
        </ChipParent>
    );
};

export default Item;
