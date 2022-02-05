import React from 'react';
import { StyledRouteLink, StyledLink } from './Link.style';

interface Props {
    to?: string; //
    href?: string; // one of these two
}

export const Link: React.FC<Props> = ({ to, href, children }) => {
    return to ? <StyledRouteLink to={to}>{children}</StyledRouteLink> : <StyledLink href={href}>{children}</StyledLink>;
};

export default Link;
