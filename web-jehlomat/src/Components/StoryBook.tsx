import { FC } from "react";
import styled from "styled-components";
import PrimaryButton from "./Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "./Buttons/SecondaryButton/SecondaryButton";
import TextInput from "./Inputs/TextInput/TextInput";

interface StoryBook {}

const Layout = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 20px;
`;

const StoryBook: FC<StoryBook> = ({}) => {
  return(
      <Layout>
          <PrimaryButton text="Primary" />
          <SecondaryButton text="Secondary" />
          <TextInput onChange={e => console.log(e.target.value)}/>
      </Layout>
  );
};

export default StoryBook;
