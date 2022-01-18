import styled, { createGlobalStyle } from 'styled-components';
import { primary, white } from '../../utils/colors';

export const GlobalBody = createGlobalStyle`
  body {
    padding-bottom: 86px;
  }
`;

export const Container = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 86px;
`;

export const PrimaryBar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    right: 0;
    bottom: (-9);
    z-index: 101;

    width: 100px;
    height: 95px;

    background-color: ${primary};
    border-bottom-left-radius: 60px;
    border-top-left-radius: 60px;

    box-shadow: 0px -2px 4px 1px rgba(147, 149, 152, 0.72);

    :hover {
        cursor: pointer;
    }
`;

export const LeftBar = styled.div`
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 100;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    padding-right: 40px;

    width: calc(100% - 115px);
    height: 86px;

    background-color: white;
    border-top-right-radius: 60px;

    box-shadow: 0px -2px 4px 1px rgba(147, 149, 152, 0.72);
`;

export const SecondaryNavigationButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 100%;
    flex-grow: 1;

    :hover {
        cursor: pointer;
    }
`;

export interface ISecondaryNavigationButtonIcon {
    selected: boolean;
}

export const SecondaryNavigationButtonIcon = styled.div<ISecondaryNavigationButtonIcon>`
    display: flex;
    justify-content: center;
    align-items: center;

    width: 40px;
    height: 40px;

    border: 2px solid ${props => (props.selected ? primary : 'white')};
    box-sizing: border-box;
    border-radius: 20px;

    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.13);

    margin-bottom: 5px;
`;

export interface ISecondaryNavigationButtonTitle {
    selected: boolean;
}

export const SecondaryNavigationButtonTitle = styled.span<ISecondaryNavigationButtonTitle>`
    font-size: 12px;

    color: ${props => (props.selected ? primary : 'black')};
`;
