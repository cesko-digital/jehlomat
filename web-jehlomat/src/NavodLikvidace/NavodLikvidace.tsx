import React, { FC } from 'react';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../Components/Buttons/TextButton/TextButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TitleBar from '../Components/Navigation/TitleBar';
import Card from './Components/Card';
import { secondary } from '../Components/Utils/Colors';

import styled from 'styled-components';

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
`;

const SubTitleLink = styled.a`
    color: ${secondary};
`;

interface INavodLikvidace {}

const NavodLikvidace: React.FunctionComponent<INavodLikvidace> = () => {
    const handleOnClickPrimaryButton = (event: React.MouseEvent<HTMLButtonElement>) => {};

    const handleOnClickTextButton = (event: React.MouseEvent<HTMLButtonElement>) => {};

    return (
        <Box sx={{ height: '100vh' }}>
            <TitleBar>Jak bezpečně zlikvidovat nález</TitleBar>
            <Grid container direction="column" justifyContent="center" alignItems="center">
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
                <Box sx={{ mt: '40px' }}>
                    <PrimaryButton text="NÁLEZ JE ZLIKVIDOVÁN" type="button" onClick={handleOnClickPrimaryButton} />
                </Box>
                <Box sx={{ mt: '40px', mb: '60px' }}>
                    <TextButton text="NÁLEZ NEBUDU LIKVIDOVAT SÁM/SAMA" type="button" onClick={handleOnClickTextButton} />
                </Box>
            </Grid>
        </Box>
    );
};

export default NavodLikvidace;
