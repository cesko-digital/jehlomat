import styled from '@emotion/styled';
import { primaryDark } from '../../utils/colors';

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

export const PageHeader = styled.h1`
    color: ${primaryDark};
    fontstyle: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 28px;
    flex-grow: 1;
`;

export const Count = styled.div`
    color: rgba(128, 130, 133, 0.57);
    line-height: 24px;
    font-size: 14px;
    font-weight: 500;
`;
