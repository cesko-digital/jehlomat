import React, { useCallback, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import { Link } from 'react-router-dom';
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

/* Go to page on mobile, show modal on desktop */
export const Navigator: React.FC<RouteProps> = ({ children, route }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const [showModal, setShowModal] = useState(false);
    const routeObj = routesById[route];
    const hideModal = useCallback(() => {
        setShowModal(false);
    }, []);

    if (!routeObj) return <>Define route obj for route: {route}</>;
    const endPathString = typeof routeObj.path === 'function' ? routeObj.path(0) : routeObj.path;

    const renderLink = () => {
        return isMobile ? <Link to={endPathString}>{children}</Link> : <StyledLink onClick={() => setShowModal(true)}>{children}</StyledLink>;
    };

    return (
        <>
            {renderLink()}
            <Modal modalHeaderText={routeObj.title || ''} open={showModal} onClose={hideModal}>
                <routeObj.Component inModal={true} />
            </Modal>
        </>
    );
};

export default Navigator;
