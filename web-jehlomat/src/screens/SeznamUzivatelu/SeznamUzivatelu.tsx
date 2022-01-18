import { FC, useState } from 'react';
import styled from 'styled-components';
import SearchInput from '../../components/Inputs/SearchInput/SearchInput';
import AddButton from '../../components/Buttons/AddButton/AddButton';
import { usersMock } from './usersMock';
import { grey } from '../../utils/colors';
import ListItem from '../../components/List/ListItem/ListItem';
import { useHistory } from 'react-router';
import { Header } from '../../components/Header/Header';

interface Props {}

const LayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;

    & > * + * {
        margin-top: 10px;
    }
`;

const TopWrapper = styled.div`
    display: inline-flex;
    flex-direction: row;
    align-items: center;

    & > * + * {
        margin-left: 10px;
    }
`;

const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;

    & > * + * {
        margin-top: 10px;
    }
`;

const ListInfo = styled.div`
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: ${grey};
`;

const SeznamUzivatelu: FC<Props> = ({}) => {
    const [users, setUsers] = useState(usersMock);
    const listTitle = `${users.length} uživatel${users.length > 0 ? (users.length === 1 ? '' : users.length < 5 ? 'é' : 'ů') : 'ů'}`;

    const history = useHistory();

    return (
        <>
            <Header mobileTitle="Seznam uživatelů" />

            <LayoutWrapper>
                <TopWrapper>
                    <SearchInput onChange={e => setUsers(usersMock.filter(item => item.name?.includes(e.target.value)))} />
                    <AddButton style={{ marginLeft: '10px' }} onClick={e => history.push('/uzivatel/novy')} />
                </TopWrapper>
                <ListInfo>{listTitle}</ListInfo>
                <ListWrapper>
                    {users.map((item, index) => {
                        return <ListItem key={`item-${index}`} {...item} />;
                    })}
                </ListWrapper>
            </LayoutWrapper>
        </>
    );
};

export default SeznamUzivatelu;
