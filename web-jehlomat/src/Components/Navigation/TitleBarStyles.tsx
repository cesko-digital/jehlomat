import styled, { createGlobalStyle } from 'styled-components';
import { primary } from '../Utils/Colors';

export const GlobalBody = createGlobalStyle`
  body {
    padding-top: 56px;
  }
`;

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 56px;
    width: 100%;

    position: fixed;
    top: 0;
    left: 0;

    z-index: 200;

    background-color: ${primary};
`;

export const NavIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;

    :hover {
        cursor: pointer;
    }
`;

interface IContent {
    isCentered: boolean;
}

export const Content = styled.div<IContent>`
    display: flex;
    justify-content: ${props => (props.isCentered ? 'center' : 'flex-start')};
    align-items: center;
    flex-grow: 1;
`;
