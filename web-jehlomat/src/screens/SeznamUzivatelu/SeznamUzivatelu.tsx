import { FC, useState } from 'react';
import styled from '@emotion/styled';
import SearchInput from '../../Components/Inputs/SearchInput/SearchInput';
import { usersMock } from './usersMock';
import { grey } from '../../utils/colors';
import ListItem from '../../Components/List/ListItem/ListItem';
import { Header } from '../../Components/Header/Header';
import StyledModal from '../../Components/Modal/StyledModal';
import PridatUzivateleModal from '../../Components/Modal/PridatUzivateleModal';

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

const SeznamUzivatelu: FC<Props> = () => {
    const [users, setUsers] = useState(usersMock);
    const listTitle = `${users.length} uživatel${users.length > 0 ? (users.length === 1 ? '' : users.length < 5 ? 'é' : 'ů') : 'ů'}`;

    return (
        <>
            <Header mobileTitle="Seznam uživatelů" />

            <LayoutWrapper>
                <TopWrapper>
                    <SearchInput onChange={e => setUsers(usersMock.filter(item => item.name?.includes(e.target.value)))} />
                    {/* <AddButton style={{ marginLeft: '10px' }} onClick={e => history.push('/uzivatel/novy')} /> */}
                    <StyledModal buttonText={'Přidat nového uživatele'} modalHeaderText={'Přidat uživatele'}>
                        <PridatUzivateleModal />
                    </StyledModal>
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
