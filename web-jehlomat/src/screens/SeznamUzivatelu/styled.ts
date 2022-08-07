import styled from '@emotion/styled';
import { greyLight, primary, primaryDark, white } from '../../utils/colors';
import { default as MIconButton } from '@mui/material/IconButton';

export const LayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    & > * + * {
        margin-top: 10px;
    }
`;

export const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;

    & > * + * {
        margin-top: 10px;
    }
`;

export const TextButton = styled.button`
    border: none;
    box-shadow: none;
    background: transparent;
    color: ${white};
    cursor: pointer;
    font-size: 20px;
    line-height: 16px;
    text-align: center;
    margin-right: 28px;
    text-decoration: underline;
    letter-spacing: 1.25px;
`;

export const IconButton = styled(MIconButton)`
    && {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        height: 44px;
        width: 44px;
        border: solid 4.4px ${primary};
        border-radius: 100%;
        background-color: ${white};
        color: ${white};
        cursor: pointer;
        padding: 0px 20px;
        display: flex;
        order: 2;
        margin-left: 16px;
    }
`;

export const PageHeader = styled.h1`
    color: ${primaryDark};
    fontstyle: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 28px;
    flex-grow: 1;
`;

export const UsersTable = styled.table`
    border-collapse: separate;
    border-spacing: 0 10px;
    font-size: 14px;

    th {
        text-align: left;
        color: #808285;
        padding: 0 14px;
    }

    &.mobile {
        td {
            font-weight: 700;

            span.second-row {
                color: #898a8d;
                margin-top: 9px;
                display: block;
            }
        }
    }
`;

export const TableRow = styled.tr`
    margin-bottom: 10px;

    td {
        background: ${white};
        border-top: 1px solid ${greyLight};
        border-bottom: 1px solid ${greyLight};
        padding: 14px;
    }

    td:first-of-type {
        border-left: 1px solid ${greyLight};
        border-radius: 8px 0 0 8px;
    }

    td:last-of-type {
        border-right: 1px solid ${greyLight};
        border-radius: 0 8px 8px 0;
        width: 16px;
        cursor: pointer;
    }

    &:hover {
        td {
            border-top: 1px solid ${primaryDark};
            border-bottom: 1px solid ${primaryDark};
        }

        td:first-of-type {
            border-left: 1px solid ${primaryDark};
        }

        td:last-of-type {
            border-right: 1px solid ${primaryDark};
        }
    }
`;

export const UserCount = styled.div`
    color: rgba(128, 130, 133, 0.57);
    line-height: 24px;
    font-size: 14px;
    font-weight: 500;
`;
