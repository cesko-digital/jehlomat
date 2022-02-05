import styled from '@emotion/styled';
import { primary } from '../../utils/colors';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background-color: ${primary};
    height: 100vh;
    color: white;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
`;

export const LogoContainer = styled.div`
    align-self: center;
`;

export const Title = styled.div`
    display: block;
    padding: 2em 2em;
    text-align: center;
    font-size: 18px;
    line-height: 21px;
    font-weight: 500;
`;

export const LinkContainer = styled.div`
    text-align: center;
    display: flex;
    align-self: center;
    margin-top: 1em;
    /*flex-direction: column;
column-count: 3;
 */
`;
export const LineVertical = styled.div`
    display: block;
    border: none;
    width: 2px;
    height: 41px;
    background-color: #ffffff;
    margin: 0 1em;
    align-self: center;
`;

export const LineHorizontal = styled.div`
    display: block;
    width: 75%;
    border: none;
    height: 2px;
    background-color: #ffffff;
    margin-top: 1em;
    margin-bottom: 1em;
    align-self: center;
`;

export const ButtonContainer = styled.div`
    margin-top: 10vh;
    margin-bottom: 2em;
`;
