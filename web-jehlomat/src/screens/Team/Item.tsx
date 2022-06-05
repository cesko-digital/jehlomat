import { Chip } from '@mui/material';
import styled from '@emotion/styled';

const ChipParent = styled.li`
    margin: 0;
    padding: 0.5em;
    text-align: left;
`;

const Item = (props: { id: string; name: string; remove: any }) => {
    return (
        <ChipParent>
            <Chip
                label={props.name}
                variant="outlined"
                onDelete={() => {
                    props.remove(props.id);
                }}
            />
        </ChipParent>
    );
};

export default Item;
