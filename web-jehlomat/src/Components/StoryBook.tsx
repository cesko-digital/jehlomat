import { FC } from 'react';
import styled from '@emotion/styled';
import AddButton from './Buttons/AddButton/AddButton';
import PrimaryButton from './Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from './Buttons/SecondaryButton/SecondaryButton';
import SearchInput from './Inputs/SearchInput/SearchInput';
import TextInput from './Inputs/TextInput/TextInput';

interface StoryBook {}

const Layout = styled.div`
    display: inline-flex;
    flex-direction: column;
    gap: 20px;
`;

const StoryBook: FC<StoryBook> = () => {
    return (
        <Layout>
            <PrimaryButton onClick={_ => alert('PrimaryButton')} text="Primary" />
            <SecondaryButton onClick={_ => alert('SecondaryButton')} text="Secondary" />
            <AddButton onClick={() => alert('AddButton')} />
            <TextInput onChange={e => console.log(e.target.value)} />
            <SearchInput onChange={e => console.log(e.target.value)} />
        </Layout>
    );
};

export default StoryBook;
