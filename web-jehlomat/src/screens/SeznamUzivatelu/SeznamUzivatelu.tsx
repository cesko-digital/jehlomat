import { FC, useState } from 'react';
import styled from '@emotion/styled';
import SearchInput from '../../Components/Inputs/SearchInput/SearchInput';
import { usersMock } from './usersMock';
import { grey, primary, primaryDark, white } from '../../utils/colors';
import ListItem from '../../Components/List/ListItem/ListItem';
import { Header } from '../../Components/Header/Header';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import { useHistory } from 'react-router';
import { Routes } from 'routes';
import Navigator from 'Components/Navigator/Navigator';
import { default as MIconButton } from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

interface Props { }

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

const TextButton = styled.button`
border: none;
box-shadow: none;
background: transparent;
color: ${white};
cursor: pointer;
font-size: 16px;
line-height: 19px;
text-align: center;
margin-bottom: 10px;
`;

const IconButton = styled(MIconButton)`
    && {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        height: 48px;
        width: 48px;
        border: solid 4.4px ${primary};
        border-radius: 100%;
        background-color: ${white};
        color: ${white};
        cursor: pointer;
        padding: 0px 20px;
        display: flex;
    }
`;

const SeznamUzivatelu: FC<Props> = () => {
    const [users, setUsers] = useState(usersMock);
    const listTitle = `${users.length} uživatel${users.length > 0 ? (users.length === 1 ? '' : users.length < 5 ? 'é' : 'ů') : 'ů'}`;
    const isMobile = useMediaQuery(media.lte('mobile'));

    const history = useHistory();
    return (
        <>
            <Header mobileTitle="Seznam uživatelů" />

            <LayoutWrapper>
                <TopWrapper>
                    <SearchInput onChange={e => setUsers(usersMock.filter(item => item.name?.includes(e.target.value)))} />
                    {/* <AddButton style={{ marginLeft: '10px' }} onClick={e => history.push('/uzivatel/novy')} /> */}

                    {isMobile ? (
                        <IconButton>
                            <Navigator route={Routes.USER_NEW}><AddIcon style={{ fill: `${primary}` }} fontSize="large"/></Navigator>
                        </IconButton>

                    ) : (

                        <TextButton style={{ marginLeft: '10px', color: `${primaryDark}` }}>
                            <Navigator route={Routes.USER_NEW}>Přidat nového uživatele</Navigator>
                        </TextButton>
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
