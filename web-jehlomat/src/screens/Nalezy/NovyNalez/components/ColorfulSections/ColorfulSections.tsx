import { FC } from 'react';
import { StyledColorfulSectionHeader } from 'screens/Nalezy/NovyNalez/components/ColorfulSections/ColorfulSections.style';

export const ColorfulSectionsHeader: FC = ({ children }) => {
    return (
        <StyledColorfulSectionHeader>
            <p>{children}</p>
        </StyledColorfulSectionHeader>
    );
};
