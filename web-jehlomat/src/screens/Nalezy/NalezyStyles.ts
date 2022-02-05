import styled from '@emotion/styled';
// import { media } from '../../utils/media';
// import { size } from '../../utils/spacing';
import { 
    fontFamilyRoboto, 
    fontWeight500,
    fontWeightBold
} from '../../utils/typography';
import { 
    // primary, 
    primaryDark, 
    primaryLight,
    white,
    black,
} from '../../utils/colors';
import Syringe from '../../assets/images/syringe.svg';
import Edit from '../../assets/images/edit.svg';

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

export const FilterLink = styled.a`
    ${fontFamilyRoboto};
    font-style: normal;
    ${fontWeight500};
    font-size: 20px;
    line-height: 16px;
    text-align: right;
    letter-spacing: 1.25px;
    text-decoration-line: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    color: ${primaryDark};
    margin-left: 24px;
    &:hover {
        color: ${primaryLight};
    }
`

export const ListWrapper = styled.table`
    background: rgba(47, 166, 154, 0.4);
    border-radius: 8px 8px 0px 0px;
    padding: 20px 43px;
    width: 100%;
    border-collapse:separate; 
    border-spacing: 0 10px;
`

export const ListHeader = styled.tr`
    witdh: 100%;
`

export const ListHeaderItem = styled.th`
    ${fontFamilyRoboto};
    font-style: normal;
    ${fontWeightBold};
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #808285;
    text-align: left;
`

export const ListItem = styled.tr`
    background: ${white};
    border: 2px solid ${white};
    box-sizing: border-box;
    border-radius: 8px;
    min-height: 50px;
    height: 50px;
    margin-bottom: 10px;
`

export const ListItemCell = styled.td`
    ${fontFamilyRoboto};
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: ${black};
    &:first-child {
        border-top-left-radius: 10px; 
        border-bottom-left-radius: 10px;
    }
    &:last-child {
        border-top-right-radius: 10px; 
        border-bottom-right-radius: 10px;
    }
`

export const SyringeIcon = styled.div`
    background-image: url(${Syringe});
    width: 15px;
    height: 27px;
`

export const EditIcon = styled.div`
    background-image: url(${Edit});
    width: 18px;
    height: 18px;
`