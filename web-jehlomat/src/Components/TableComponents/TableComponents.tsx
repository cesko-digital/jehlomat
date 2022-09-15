import styled from '@emotion/styled';
import { greyLight, primaryDark, white } from 'utils/colors';

export const Table = styled.table`
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

        &.link {
            color: ${primaryDark};
        }
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
