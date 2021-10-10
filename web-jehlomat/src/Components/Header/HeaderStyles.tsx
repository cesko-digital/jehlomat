import styled, {createGlobalStyle} from "styled-components";
import {primary} from '../Utils/Colors';
import {fontFamilyRoboto} from '../Utils/Typography';

export const Container = styled.div`
  background-color: ${primary};
  ${fontFamilyRoboto};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;
  height: 80px;
  font-size: 1em;
  line-height: 16px;
  letter-spacing: 1.25px;
  color: white;
`

export const LinkContainer= styled.div`
    display: flex;
    flex-direction: row;
  margin-right: 1.5em;
    `