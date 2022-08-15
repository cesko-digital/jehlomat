import { FC } from 'react';
import Box from '@mui/material/Box';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import { Header } from '../../Components/Header/Header';
import { Link } from 'react-router-dom';
import { LINKS } from 'routes';
import { NavodyHeader, NavodyContainer, NavodyContent, NavodyNumber, NavodySection, NavodyTitle, NavodyDescription, NavodyDescriptionLink } from 'screens/Navody/NavodyStyledComponents';

const contactCentrumLink = 'https://www.drogy-info.cz/mapa-pomoci/?t=2&r=#result';

const NavodLikvidace: FC = () => (
    <>
        <Header mobileTitle={'Jak bezpečně zlikvidovat nález'} />
        <NavodyContainer>
            <NavodyHeader>Jak bezpečně zlikvidovat nález</NavodyHeader>
            <Box>
                <NavodySection>
                    <NavodyNumber>1</NavodyNumber>
                    <NavodyContent>
                        <NavodyTitle>Připravte si uzavírací nádobu</NavodyTitle>
                        <NavodyDescription>např. láhev, sklenici, plechovku</NavodyDescription>
                    </NavodyContent>
                </NavodySection>
                <NavodySection>
                    <NavodyNumber>2</NavodyNumber>
                    <NavodyContent>
                        <NavodyTitle>Seberte injekční stříkačku</NavodyTitle>
                        <NavodyDescription>vezměte ji pomocí papírového kapesníku na druhém konci, než je jehla</NavodyDescription>
                    </NavodyContent>
                </NavodySection>
                <NavodySection>
                    <NavodyNumber>3</NavodyNumber>
                    <NavodyContent>
                        <NavodyTitle>Vložte stříkačku do otevřené nádoby jehlou napřed</NavodyTitle>
                        <NavodyDescription>neulomte jehlu stříkačky, mohli byste se poranit</NavodyDescription>
                    </NavodyContent>
                </NavodySection>
                <NavodySection>
                    <NavodyNumber>4</NavodyNumber>
                    <NavodyContent>
                        <NavodyTitle>Uzavřete nádobu</NavodyTitle>
                        <NavodyDescription>v případě užití plechovky ji sešlápněte</NavodyDescription>
                    </NavodyContent>
                </NavodySection>

                <NavodySection>
                    <NavodyNumber>5</NavodyNumber>
                    <NavodyContent>
                        <NavodyTitle>Odevzdejte zajištěnou stříkačku</NavodyTitle>
                        <NavodyDescription>
                            ideálně do nejbližšího{' '}
                            <NavodyDescriptionLink href={contactCentrumLink} target="_blank">
                                kontaktního centra
                            </NavodyDescriptionLink>{' '}
                            nebo na služebnu Městské policie, v krajním případě ji vyhoďte do koše
                        </NavodyDescription>
                    </NavodyContent>
                </NavodySection>

                <NavodySection>
                    <Box mt={2} display="flex" flexDirection="column" alignItems="center" width="100%">
                        <Link to={LINKS.HOME}>
                            <PrimaryButton text="Zpět na domovskou stránku" />
                        </Link>
                    </Box>
                </NavodySection>
            </Box>
        </NavodyContainer>
    </>
);

export default NavodLikvidace;
