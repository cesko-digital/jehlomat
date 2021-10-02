import { FC } from "react";
import styled from "styled-components";
import PrimaryButton from "./Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "./Buttons/SecondaryButton/SecondaryButton";

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
      </Layout>
  );
};

export default StoryBook;
