import React, { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

interface Props {
    to: string;
    modal: React.ReactNode;
    // children is text of the link
}

const StyledLink = styled.a`
    color: inherit;
  text-decoration: inherit;
`;

/* Go to page on mobile, show modal on desktop */
export const Navigator: React.FC<Props> = ({ to, children, modal }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const [showModal, setShowModal] = useState(false);

    const renderLink = () => {
        // TODO
        return isMobile ? (
            <Link to={to}>{children}</Link>
        ) : (
            <StyledLink href="#" onClick={() => setShowModal(true)} >
                {children}
            </StyledLink>
        );
    };

    return (
        <>
            {renderLink()}
            {/* // TODO  show and handle modal with portal? */}
            {showModal && modal}
        </>
    );
};

export default Navigator;
