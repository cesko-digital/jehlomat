import styled, {createGlobalStyle} from "styled-components";
import {primaryDark} from '../Utils/Colors';
import {fontFamilyRoboto} from '../Utils/Typography';

export const Container = styled.div`
    background-color: ${primaryDark};
    ${fontFamilyRoboto};
    display: flex;
    flex-direction: row;
    overflow: hidden;
    width: 100%;
    height: auto;
    padding: 1em 0;
    margin-top: -200px;
    position: absolute;
    bottom: 0;
    `

export const LinkContainer= styled.div`
    display: flex;
    flex-direction: row;
    `