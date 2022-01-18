import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from './components/Card';
import styled from '@emotion/styled';
import { secondary } from '../../utils/colors';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../components/Buttons/TextButton/TextButton';
import { Header } from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import { LINKS } from '../../utils/links';
import { useMediaQuery } from '@mui/material';
import { TextHeader } from './NavodLinkvidaceStyles';
import { media } from '../../utils/media';

const contactCentrumLink = 'https://www.drogy-info.cz/mapa-pomoci/?t=2&r=#result';

const SubTitle = styled.p`
    font-size: 14px;
    font-family: Roboto;
    font-weight: 400;
    line-height: 16px;
    color: #898a8d;
    margin: 0;
    padding: 0;
    text-align: center;

    @media ${media.gt('mobile')} {
        text-align: left;
    }
`;

const SubTitleLink = styled.a`
    color: ${secondary};
`;

interface Props {}

const NavodLikvidace: FC<Props> = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <>
            <Header mobileTitle="Jak bezpečně zlikvidovat nález" />

            <Box maxWidth={800} width={1} ml="auto" mr="auto" minHeight={'100vh'}>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    {!isMobile && (
                        <Box mt={12} bgcolor="#2FA69A" width={1}>
                            <TextHeader>Jak bezpečně zlikvidovat nález</TextHeader>
                        </Box>
                    )}

                    <Card number="1" title="Připravte si uzavírací nádobu" backgroundColor="#2FA69A52">
                        <SubTitle>např. láhev, sklenici, plechovku</SubTitle>
                    </Card>
                    <Card number="2" title="Seberte injekční stříkačku" backgroundColor="#2FA69A3D">
                        <SubTitle>vezměte ji pomocí papírového kapesníku na druhém konci, než je jehla</SubTitle>
                    </Card>
                    <Card number="3" title="Vložte stříkačku do otevřené nádoby jehlou napřed" backgroundColor="#2FA69A29">
                        <SubTitle>neulomte jehlu stříkačky, mohli byste se poranit</SubTitle>
                    </Card>
                    <Card number="4" title="Uzavřete nádobu" backgroundColor="#2FA69A14">
                        <SubTitle>v případě užití plechovky ji sešlápněte</SubTitle>
                    </Card>
                    <Card number="5" title="Odevzdejte zajištěnou stříkačku" backgroundColor="#2FA69A0A">
                        <SubTitle>
                            ideálně do nejbližšího{' '}
                            <SubTitleLink href={contactCentrumLink} target="_blank">
                                kontaktního centra
                            </SubTitleLink>{' '}
                            nebo na služebnu Městské policie, v krajním případě ji vyhoďte do koše
                        </SubTitle>
                    </Card>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} bgcolor={isMobile ? undefined : '#2FA69A0A'} width={1} mb={isMobile ? 0 : 16}>
                        <Box mt={4}>
                            <Link to={LINKS.newFind(3)}>
                                <PrimaryButton text="NÁLEZ JE ZLIKVIDOVÁN" type="button" />
                            </Link>
                        </Box>
                        <Box mt={4} mb={6}>
                            <Link to={LINKS.policeAssistance}>
                                <TextButton text="NÁLEZ NEBUDU LIKVIDOVAT SÁM/SAMA" type="button" />
                            </Link>
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </>
    );
};

export default NavodLikvidace;
