import styled from '@emotion/styled';
import { primary, primaryDark } from '../../utils/colors';
import { media } from 'utils/media';

export const Container = styled.div`
    width: auto;
    background-color: ${primaryDark};
    flex-direction: row-reverse;
    position: relative;
    height: 60px;
    display: flex;

    @media ${media.lte('mobile')} {
        height: 56px;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 200;
        background-color: ${primary};
        flex-direction: row;
    }}

`;

export const NavIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    position: absolute;
    :hover {
        cursor: pointer;
    }

    @media ${media.lte('mobile')} {
        right: auto;
    }}
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
