import styled, {createGlobalStyle} from "styled-components";
import {primary} from '../Utils/Colors';
import {fontFamilyRoboto} from '../Utils/Typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background-color: ${primary};
  height: 100vh;
  color: white;
`

export const LogoContainer = styled.div`
  align-self: center;
`

export const Title = styled.div`
  display: block;
  padding: 2em 2em;
  text-align: center;
  font-size: 16.5px;
  line-height: 21px;
`

export const LinkContainer = styled.div`
  text-align: center;
  display: flex;
  align-self: center;
  margin-top: 1em;
  /*flex-direction: column;
  column-count: 3;
   */
  
`
export const LineVertical = styled.div`
  display: block;
  border: none;
  width: 2px;
  height: 41px;
  background-color: #FFFFFF;
  margin: 0 1em;
`

export const LineHorizontal = styled.div`
  display: block;
  width: 75%;
  border: none;
  height: 2px;
  background-color: #FFFFFF;
  margin-top: 1em;
  margin-bottom: 1em;
  align-self: center;
`

export const ButtonContainer = styled.div`
    margin-top: 10vh;
    margin-bottom: 2em;
`

export const InfoContainer = styled.div`
`

export const AnonymousContainer = styled.div`
`