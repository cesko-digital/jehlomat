import styled from "styled-components";
import { fontFamilyRoboto, fontWeightBold } from "../Utils/Typography";

export const Wrapper = styled.section`
  padding: 4em;
  text-align: center;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0.2rem;
  text-align: flex-start;
  width: 100%;
  font-family: Roboto;
`;
