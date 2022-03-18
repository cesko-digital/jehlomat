import {NavLink} from "react-router-dom";
import styled from '@emotion/styled';
import { fontFamilyRoboto, fontWeight500 } from 'utils/typography';
import {
    primaryDark,
    white,
    darkGrey,
    textGold,
} from 'utils/colors';
import Syringe from 'assets/images/syringe.svg';

export const Button = styled.button`
    background: ${white};
    border: 1px solid rgba(14, 118, 108, 1);
    border-radius: 18px;
    color: rgba(14, 118, 108, 1);
    cursor: pointer;
    font-size: 1rem;
    height: 36px;
    min-width: 160px;
    padding-left: 16px;
    padding-right: 16px;
    transition: all 300ms;
    
    &:hover {
        background: rgba(14, 118, 108, 0.1);
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(14, 118, 108, 0.2);
    }
`;

export const Controls = styled.div`
    display: flex;
    
    & > * {
        margin-right: 16px;
        
        &:last-of-type:not(div) {
            margin-right: 0;
        }
    }
`;

export const Links = styled.nav`
    background: ${white};
    border-radius: 9px;
    box-shadow: 0 6px 12px rgb(0 0 0 / 10%);
    margin: 0;
    padding: 0;
    width: 192px;
    
    & > ul {
        margin: 0;
        padding: 0;
        list-style: none;
        
        li {
            position: relative;
            
            &:after {
                content: '';
                background: rgba(33, 33, 33, 0.08);
                display: block;
                position: absolute;
                bottom: 0;
                height: 1px;
                width: 90%;
                left: 50%;
                transform: translateX(-50%);
            }
            
            &:last-of-type {
                &:after {
                    display: none;
                }
            }
        }
    }
`;

export const ActionLink = styled(NavLink)`
    align-items: center;
    border-radius: 9px;
    box-sizing: border-box;
    color: rgba(76, 78, 80, 1);
    display: flex;
    height: 44px;
    justify-content: space-between;
    margin: 0;
    padding: 0 12px;
    text-decoration: none;
    transition: all 300ms;
    
    &:hover {
        background: rgba(218, 218, 218, 0.5);
        color: rgba(76, 78, 80, 0.7);
    }
    
    svg {
        display: inline-block;
    }
`;

export const TextHeader = styled.h1`
    ${fontFamilyRoboto};
    color: ${primaryDark};
    font-style: normal;
    ${fontWeight500};
    font-size: 20px;
    line-height: 16px;
    letter-spacing: 1.25px;
    text-transform: uppercase;
`;

export const SyringeIcon = styled.div`
    background-image: url(${Syringe});
    width: 15px;
    height: 27px;
`;

export const RoundButton = styled.button`
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 50%;
    color: rgba(128, 130, 133, 1);
    display: inline-flex;
    height: 32px;
    justify-content: center;
    outline: none;
    width: 32px;
    
    &:focus {
        outline: none;
    }
`;

export const TextMuted = styled.span`
    color: ${darkGrey};
`;
export const TextGold = styled.span`
    color: ${textGold};
    ${fontWeight500};
`;
export const TextHighlight = styled.span`
    color: ${primaryDark};
    ${fontWeight500};
`;
export const TextMutedBold = styled(TextMuted)`
    ${fontWeight500}
`;

export const CheckboxRadio = styled.input``;
