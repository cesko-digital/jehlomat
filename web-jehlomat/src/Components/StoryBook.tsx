import { FC } from 'react';
import styled from 'styled-components';
import AddButton from './Buttons/AddButton/AddButton';
import PrimaryButton from './Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from './Buttons/SecondaryButton/SecondaryButton';
import PasswordInput from './Inputs/PasswordInput/PasswordInput';
import SearchInput from './Inputs/SearchInput/SearchInput';
import TextInput from './Inputs/TextInput/TextInput';

interface StoryBook {}

const Layout = styled.div`
    display: inline-flex;
    flex-direction: column;
    gap: 20px;
`;

const StoryBook: FC<StoryBook> = ({}) => {
    return (
        <Layout>
            <PrimaryButton onClick={e => alert('PrimaryButton')} text="Primary" />
            <SecondaryButton onClick={e => alert('SecondaryButton')} text="Secondary" />
            <AddButton onClick={e => alert('AddButton')} />
            <TextInput onChange={e => console.log(e.target.value)} />
            <SearchInput onChange={e => console.log(e.target.value)} />
            <PasswordInput />
        </Layout>
    );
};

export default StoryBook;
