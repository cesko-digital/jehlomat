import React, { useCallback, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import {Link, useHistory} from 'react-router-dom';
import styled from '@emotion/styled';
import { Routes, routesById } from 'routes';
import Modal from 'Components/Modal/Modal';

interface RouteProps {
    route: Routes;
}

const StyledLink = styled.span`
    color: inherit;
    text-decoration: inherit;
`;

export const ModalContext = React.createContext({
    isModalVisible: false,
    openModal: () => {},
    closeModal: () => {},
});

/* Go to page on mobile, show modal on desktop */
export const Navigator: React.FC<RouteProps> = ({ children, route }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const [showModal, setShowModal] = useState(false);
    const [originalUrl, setOriginalUrl] = useState();
    const routeObj = routesById[route];
    const hideModal = useCallback(() => {
        setShowModal(false);
    }, []);
    const history = useHistory();

    if (!routeObj) {
        console.warn(`Define route obj for route: ${route}`)
        return null;
    }
    const endPathString = typeof routeObj.path === 'function' ? routeObj.path(0) : routeObj.path;

    const onModalShow = () => {
        setShowModal(true);
        window.history.replaceState(null, routeObj.title || '', `/#${routeObj.path}`)
    }

    const renderLink = () => {
        return isMobile ? <Link to={endPathString}>{children}</Link> : <StyledLink onClick={onModalShow}>{children}</StyledLink>;
    };

    return (
        <>
            {renderLink()}
            <ModalContext.Provider value={{ isModalVisible: showModal, openModal: onModalShow, closeModal: hideModal }}>
            <Modal modalHeaderText={routeObj.title || ''} open={showModal} onClose={hideModal}>
                <routeObj.Component inModal={true} />
            </Modal>
            </ModalContext.Provider>
        </>
    );
};

export default Navigator;
