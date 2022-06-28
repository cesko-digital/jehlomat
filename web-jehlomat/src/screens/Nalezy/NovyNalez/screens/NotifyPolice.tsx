import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ColorfulSectionsHeader } from 'screens/Nalezy/NovyNalez/components/ColorfulSections/ColorfulSections';
import {
    StyledColorfulContent,
    StyledColorfulNumber,
    StyledColorfulSection,
    StyledColorfulTitle,
    StyledColorfulDescription,
} from 'screens/Nalezy/NovyNalez/components/ColorfulSections/ColorfulSections.style';
import { Header } from 'Components/Header/Header';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from 'Components/Buttons/TextButton/TextButton';
import { primary } from 'utils/colors';

export const NotifyPolice: React.FC = props => {
    return (
        <>
            <Header mobileTitle={''} />
            <Box my={8}>
                <Container maxWidth={'md'}>
                    <ColorfulSectionsHeader>Jak ohlásit nález na policii</ColorfulSectionsHeader>
                    <Box>
                        {['Zavolejte na 156', ' Nahlaste nález injekční stříkačky', 'Je-li to možné, vyčkejte na příjezd strážníků'].map((title, key) => (
                            <StyledColorfulSection>
                                <StyledColorfulNumber>{key + 1}</StyledColorfulNumber>
                                <StyledColorfulContent>
                                    <StyledColorfulTitle>{title}</StyledColorfulTitle>
                                </StyledColorfulContent>
                            </StyledColorfulSection>
                        ))}

                        <StyledColorfulSection>
                            <StyledColorfulNumber>4</StyledColorfulNumber>
                            <StyledColorfulContent>
                                <StyledColorfulTitle>Pokud nemůžete počkat, popište místo nálezu co nejpodrobněji</StyledColorfulTitle>
                                <StyledColorfulDescription>Pokud je místo nálezu těžké popsat, označte ho nějakým předmětem.</StyledColorfulDescription>
                            </StyledColorfulContent>
                        </StyledColorfulSection>

                        <StyledColorfulSection>
                            <Box mt={2} display="flex" flexDirection="column" alignItems="center" width="100%">
                                <PrimaryButton text="NÁLEZ JE NAHLÁŠEN" />
                                <Box mt={4}>
                                    <TextButton text="NÁLEZ ZLIKVIDUJI SVÉPOMOCÍ" color={primary} />
                                </Box>
                            </Box>
                        </StyledColorfulSection>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default NotifyPolice;
