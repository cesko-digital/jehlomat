import styled from '@emotion/styled';
import { fontFamilyRoboto, fontWeight500, fontWeightBold } from '../../utils/typography';
import {
    primaryDark,
    primaryLight,
    white,
    black,
    // greyLight,
    darkGrey,
    textGold,
} from '../../utils/colors';
import Syringe from '../../assets/images/syringe.svg';
import Edit from '../../assets/images/edit.svg';
import {ISyringe} from "./syringeMock";
import {NavLink} from "react-router-dom";

const HIGHLIGHT_DEFAULT_COLOR = 'rgba(217, 217, 217, 1)';
const HIGHLIGHT_WAITING_COLOR = 'rgba(254, 171, 13, 1)';
const BG_WAITING_COLOR = 'rgba(254, 171, 13, 0.1)';

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
        box-shadow: 0 0 0 4px rgba(14, 118, 108, 0.2);
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
    padding: 0 12px;
    margin: 0;
    text-decoration: none;
    
    &:hover {
        background: rgba(218, 218, 218, 0.5);
        color: rgba(76, 78, 80, 0.7);
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

export const ListWrapper = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
`;

export const ListHeader = styled.tr`
    witdh: 100%;
`;

export const ListHeaderItem = styled.th`
    ${fontFamilyRoboto};
    font-style: normal;
    ${fontWeightBold};
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #808285;
    text-align: left;
`;

export const ListItem = styled.tr`
    background: ${white};
    border: 2px solid ${white};
    box-sizing: border-box;
    border-radius: 8px;
    min-height: 50px;
    height: 50px;
    margin-bottom: 10px;
    
    &:hover > td {
        background: rgba(14, 118, 108, 0.1) !important;
        border-color: rgba(14, 118, 108, 1) !important;
    }
`;

interface ListItemCellProps {
    syringe: ISyringe;
}

const highlight = (props: ListItemCellProps) => {
    if (!props.syringe.demolished && !props.syringe.reservedTill) return HIGHLIGHT_WAITING_COLOR;
        
    return HIGHLIGHT_DEFAULT_COLOR;
};

const bg = (props: ListItemCellProps) => {
    if (!props.syringe.demolished && !props.syringe.reservedTill) return BG_WAITING_COLOR;

    return 'transparent';
};

export const ListItemCell = styled.td<ListItemCellProps>`
    ${fontFamilyRoboto};
    background: ${bg};
    border-top: 1px solid ${highlight};
    border-bottom: 1px solid ${highlight};
    color: ${black};
    letter-spacing: 0.15px;
    line-height: 1.5;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: normal;
    transition: all 300ms;
    
    &:first-of-type {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        border-left: 1px solid ${highlight};
        padding-left: 14px;
    }
    &:last-of-type {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border-right: 1px solid ${highlight};
    }
`;

export const SyringeIcon = styled.div`
    background-image: url(${Syringe});
    width: 15px;
    height: 27px;
`;

export const EditIcon = styled.div`
    background-image: url(${Edit});
    width: 18px;
    height: 18px;
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
