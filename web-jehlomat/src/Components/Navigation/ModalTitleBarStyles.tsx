import styled from '@emotion/styled';
import {Container, NavIcon, Content} from './TitleBarStyles';
import { primaryDark } from '../../utils/colors';

export const ModalContainer = styled(Container)<{ mobile?: boolean }>`
    ${props =>
        !props.mobile &&
        `
        background-color: ${primaryDark};
        flex-direction: row-reverse;

    `}
`;

export const ModalNavIcon = styled(NavIcon)<{ mobile?: boolean }>`
${props =>
    !props.mobile &&
    `
    position: absolute;
    top: 7px;
    `}
`;

export const ModalContent = styled(Content)<{ isCentered?: boolean }>`

`;
