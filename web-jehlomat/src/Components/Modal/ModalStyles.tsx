import styled from 'styled-components';

export const ModalContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    background: rgba(255, 255, 255, 0.8);

    z-index: 999;

    display: flex;
    justify-content: center;
    align-items: center;
`;

interface IModalBody {
    width?: number | string;
    height?: number | string;
}

export const ModalBody = styled.div<IModalBody>`
    width: ${props => props.width || '90vw'};
    height: ${props => props.height || '90vh'};

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    div,
    p,
    button,
    h1,
    h2,
    h3,
    h4 {
        margin-bottom: 16px;
    }
`;
