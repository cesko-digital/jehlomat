import styled from "@emotion/styled";
import {fontFamilyRoboto, fontWeightBold} from "utils/typography";
import {black, white} from "utils/colors";
import {ISyringe} from "../syringeMock";

const HIGHLIGHT_DEFAULT_COLOR = 'rgba(217, 217, 217, 1)';
const HIGHLIGHT_WAITING_COLOR = 'rgba(254, 171, 13, 1)';
const BG_WAITING_COLOR = 'rgba(254, 171, 13, 0.1)';

interface SortableSortableListHeaderItemProps {
  direction?: "ASC" | "DESC";
}

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

const order = (props: SortableSortableListHeaderItemProps) => {
  if (props.direction === "ASC") {
    return "PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDYgMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zIDBMNS41OTgwOCA0LjVIMC40MDE5MjRMMyAwWiIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPHBhdGggZD0iTTMgMTNMMC40MDE5MjQgOC41SDUuNTk4MDhMMyAxM1oiIGZpbGw9IiMwRTc2NkMiLz4KPC9zdmc+";
  }

  if (props.direction === "DESC") {
    return "PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDYgMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zIDBMNS41OTgwOCA0LjVIMC40MDE5MjRMMyAwWiIgZmlsbD0iIzBFNzY2QyIvPgo8cGF0aCBkPSJNMyAxM0wwLjQwMTkyNCA4LjVINS41OTgwOEwzIDEzWiIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPC9zdmc+";
  }

  return "PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDYgMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zIDBMNS41OTgwOCA0LjVIMC40MDE5MjRMMyAwWiIgZmlsbD0iIzBFNzY2QyIvPgo8cGF0aCBkPSJNMyAxM0wwLjQwMTkyNCA4LjVINS41OTgwOEwzIDEzWiIgZmlsbD0iIzBFNzY2QyIvPgo8L3N2Zz4=";
};

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
    padding-right: 12px;
    position: relative;
`;

export const SortableListHeaderItem = styled(ListHeaderItem)<SortableSortableListHeaderItemProps>`
    cursor: pointer;
    user-select: none;
    
    &:after {
        content: '';
        display: inline-block;
        width: 6px;
        height: 14px;
        position: relative;
        top: 4px;
        left: 4px;
        background-image: url('data:image/svg+xml;base64,${order}');
        background-repeat: no-repeat;
    }
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