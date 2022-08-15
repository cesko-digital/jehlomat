import React from 'react';
import Box from '@mui/material/Box';
import { NavodyHeader, NavodyContainer, NavodyContent, NavodyNumber, NavodySection, NavodySectionNoBackground, NavodyTitle, NavodyDescription } from 'screens/Navody/NavodyStyledComponents';
import { Header } from 'Components/Header/Header';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import Link from 'Components/Link';
import { LINKS } from 'routes';

export const NotifyPolice: React.FC = () => {
    return (
        <>
            <Header mobileTitle={'Jak ohlásit nález na policii'} />
            <NavodyContainer>
                <NavodyHeader>Jak ohlásit nález na policii</NavodyHeader>
                <Box>
                    {['Zavolejte na 156', ' Nahlaste nález injekční stříkačky', 'Je-li to možné, vyčkejte na příjezd strážníků'].map((title, key) => (
                        <NavodySection>
                            <NavodyNumber>{key + 1}</NavodyNumber>
                            <NavodyContent>
                                <NavodyTitle>{title}</NavodyTitle>
                            </NavodyContent>
                        </NavodySection>
                    ))}

                    <NavodySection>
                        <NavodyNumber>4</NavodyNumber>
                        <NavodyContent>
                            <NavodyTitle>Pokud nemůžete počkat, popište místo nálezu co nejpodrobněji</NavodyTitle>
                            <NavodyDescription>Pokud je místo nálezu těžké popsat, označte ho nějakým předmětem.</NavodyDescription>
                        </NavodyContent>
                    </NavodySection>

                    <NavodySectionNoBackground>
                        <Box mt={2} display="flex" flexDirection="column" alignItems="center" width="100%">
                            <Link to={LINKS.HOME}>
                                <PrimaryButton text="Zpět na domovskou stránku" />
                            </Link>
                        </Box>
                    </NavodySectionNoBackground>
                </Box>
            </NavodyContainer>
        </>
    );
};

export default NotifyPolice;
