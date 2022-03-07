import { FC } from 'react';
import styled from '@emotion/styled';
import { grey, greyLight, primaryDark, white } from '../../../utils/colors';
import { fontFamilyRoboto, fontWeightBold } from '../../../utils/typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';

export interface IListItem {
    id: Number;
    name?: String;
    email: String;
    state: String;
}

const Text = styled.div`
    display: flex;
    padding: 10px;
    flex-direction: column;
    flex: 4;
`;
const Edit = styled.div`
    display: flex;
    padding: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    cursor: pointer;
`;

const Name = styled.div`
    ${fontFamilyRoboto}
    ${fontWeightBold}
    font-size: 14px;
    font-weight: bold;
    line-height: 16px;
`;

const Email = styled.div`
    ${fontFamilyRoboto}
    ${fontWeightBold}
    color: ${grey};
    padding-top: 9px;
    font-size: 14px;
    font-weight: bold;
    line-height: 16px;
`;

const ListIt = styled.li`
    list-style: none;
    background: ${white};
    border: 1px solid ${greyLight};
    box-sizing: border-box;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: row;
`;

const ListItem: FC<IListItem> = ({ ...props }) => {
    const history = useHistory();

    return (
        <ListIt>
            <Text>
                {props.name ? <Name>{props.name}</Name> : null}
                <Email>{props.email}</Email>
            </Text>
            <Edit onClick={e => history.push('/uzivatel/upravit')}>
                <FontAwesomeIcon icon={faPencilAlt} size="1x" color={primaryDark} />
            </Edit>
        </ListIt>
    );
};

export default ListItem;
