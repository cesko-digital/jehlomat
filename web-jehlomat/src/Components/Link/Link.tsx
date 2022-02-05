import React from 'react';
import { StyledRouteLink, StyledLink } from './Link.style';


interface Props {
    to?: string; //
    href?: string; // one of these two
    className?: string;
    onClick?: () => void;
}

export const Link: React.FC<Props> = ({ to, href, children, className, onClick }) => {
    return to ? (
        <StyledRouteLink className={className} to={to} onClick={onClick}>
            {children}
        </StyledRouteLink>
    ) : (
        <StyledLink className={className} href={href} onClick={onClick}>
            {children}
        </StyledLink>
    );
};

export default Link;
