import styled from '@emotion/styled';
import { primary } from '../../utils/colors';

export const Container = styled.div<{ mobile?: boolean }>`
    display: flex;
    flex-direction: row;
    height: 56px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    background-color: ${primary};

    ${props =>
        !props.mobile &&
        `
        position: static;
        width: auto;
    `}
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
