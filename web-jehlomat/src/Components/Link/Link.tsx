import React from 'react';
import { StyledRouteLink, StyledLink } from './Link.style';

interface Props {
    to?: string; //
    href?: string; // one of these two
    className?: string;
}

export const Link: React.FC<Props> = ({ to, href, children, className }) => {
    return to ? (
        <StyledRouteLink className={className} to={to}>
            {children}
        </StyledRouteLink>
    ) : (
        <StyledLink className={className} href={href}>
            {children}
        </StyledLink>
    );
};

export default Link;
