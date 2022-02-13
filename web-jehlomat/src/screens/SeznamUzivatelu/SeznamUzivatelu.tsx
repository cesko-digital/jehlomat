import { FC, useState } from 'react';
import styled from '@emotion/styled';
import SearchInput from '../../Components/Inputs/SearchInput/SearchInput';
import { usersMock } from './usersMock';
import { grey } from '../../utils/colors';
import ListItem from '../../Components/List/ListItem/ListItem';
import { useHistory } from 'react-router';
import { Header } from '../../Components/Header/Header';
import { useMediaQuery } from '@mui/material';
import AddButton from '../../Components/Buttons/AddButton/AddButton';
import TextButton from '../../Components/Buttons/TextButton/TextButton';
import { media } from '../../utils/media';
import { primaryDark } from '../../utils/colors';

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

const buttonStyles = {
    marginLeft: '10px',
    marginBottom: '0px',
    color: `${primaryDark}`,
    textDecoration: 'underline'
}

const SeznamUzivatelu: FC<Props> = (props: any) => {
    const [users, setUsers] = useState(usersMock);
    const listTitle = `${users.length} uživatel${users.length > 0 ? (users.length === 1 ? '' : users.length < 5 ? 'é' : 'ů') : 'ů'}`;
    const isMobile = useMediaQuery(media.lte('mobile'));
    let history = useHistory();

    const handleOpen = () => {
        history.push({
            pathname: '/uzivatel/novy',
            state: { openModal: true }
        });
    };

    return (
        <>
            <Header mobileTitle="Seznam uživatelů" />
            <LayoutWrapper>
                <TopWrapper>
                    <SearchInput onChange={e => setUsers(usersMock.filter(item => item.name?.includes(e.target.value)))} />
                    {isMobile ? (
                        <AddButton style={buttonStyles} onClick={handleOpen} />
                    ) : (
                        <TextButton text={'Přidat nového uživatele'} style={buttonStyles} onClick={handleOpen} />
                    )}
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
