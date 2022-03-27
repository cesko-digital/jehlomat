import { FC } from 'react';
import { StyledColorfulSectionHeader } from './ColorfulSections.style';

export const ColorfulSectionsHeader: FC = ({ children }) => {
    return (
        <StyledColorfulSectionHeader>
            <p>{children}</p>
        </StyledColorfulSectionHeader>
    );
};
