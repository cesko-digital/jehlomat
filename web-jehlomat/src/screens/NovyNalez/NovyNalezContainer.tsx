import React, { useCallback } from 'react';
import { FC } from 'react';
import Box from '@mui/material/Box';
import Container, {ContainerProps} from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { INovaJehla, StepsEnum } from 'screens/NovyNalez/components/types';
import { Header } from 'Components/Header/Header';
import Info from 'screens/NovyNalez/components/Info';
import Potvrzeni from 'screens/NovyNalez/screens/Potvrzeni';
import ZadatNalezMapa from 'screens/NovyNalez/screens/ZadatNalezMapa';
import ZadavaniNalezu from 'screens/NovyNalez/screens/ZadavaniNalezu';
import { API } from 'config/baseURL';
import { primary } from 'utils/colors';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from 'Components/Buttons/TextButton/TextButton';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';

import { useRecoilState, useRecoilValue } from 'recoil';
import { newSyringeInfoErrorState, newSyringeInfoState, newSyringeStepState } from 'screens/NovyNalez/components/store';
import MapComponent from 'screens/NovyNalez/components/Map';
import { FloatinButtonContainer } from 'screens/NovyNalez/components/styled';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import Stepper from 'screens/NovyNalez/components/Stepper';

const StepsTitleMap = new Map<StepsEnum, string>([
    [StepsEnum.Start, 'Start přidání nálezu'],
    [StepsEnum.Mapa, 'Zadejte nález na mapě'],
    [StepsEnum.Info, 'Info'],
    [StepsEnum.Nahled, 'Náhled stříkačky'],
    [StepsEnum.Potvrzeni, 'Potvrzení stříkačky'],
]);

const NovyNalezContainer: FC = () => {
    const [currentStep, setCurrentStep] = useRecoilState(newSyringeStepState);

    const [newSyringeInfo, setNewSyringeInfo] = useRecoilState(newSyringeInfoState);

    const handleInputChange = (key: string, value: string | number) => setNewSyringeInfo({ ...newSyringeInfo, [key]: value });


    const handleOnSubmit = () => {
        setCurrentStep(StepsEnum.Nahled);
    };

    const handleOnSave = async () => {
        try {
            const { lat, lng, datetime, count, info, photo } = newSyringeInfo;

            const apiSyringe = {
                createdAt: datetime,
                gps_coordinates: `${lng} ${lat}`,
                note: info,
                photo,
                ...(count ? { count: typeof count === 'number' ? count : parseInt(count) } : {}),
            };

            const data = await API.post('/syringe', apiSyringe);

            if (data.status === 200 || data.status === 201) {
                setCurrentStep(StepsEnum.Potvrzeni);
            }
        } catch (error) {
            // Error handling 101
            console.log(error);
        }
    };

    const handleGoToEdit = useCallback(() => {
        setCurrentStep(StepsEnum.Info);
    }, [setCurrentStep]);

    const handleEditLocation = useCallback(() => {
        setCurrentStep(StepsEnum.Mapa);
    }, [setCurrentStep]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header mobileTitle={StepsTitleMap.get(currentStep) || ''} />
            <NovyNalez {...{ newSyringeInfo, handleInputChange, handleOnSubmit, handleOnSave, handleGoToEdit, handleEditLocation }} />
        </Box>
    );
};

const NovyNalez: FC<INovyNalez> = ({ newSyringeInfo, handleInputChange, handleOnSave, handleOnSubmit, handleGoToEdit, handleEditLocation }) => {
    const [currentStep] = useRecoilState(newSyringeStepState);
    const newSyringeInfoError = useRecoilValue(newSyringeInfoErrorState)
    const isMobile = useMediaQuery(media.lte('mobile'));

    const isSubmitDisabled = () => {
        // Pokud je na formulari chyba, zablokujeme Submit button
        return !Object.values(newSyringeInfoError).every(error => error === undefined);
    }

    switch (currentStep) {
        case StepsEnum.Start:
            return <Info />;
        case StepsEnum.Mapa:
            return (
                <SyringeLayout>
                    <ZadatNalezMapa userSelectedLocation={[newSyringeInfo.lat, newSyringeInfo.lng]} />
                </SyringeLayout>
            );
        case StepsEnum.Info:
            return (
                <SyringeLayout sx={{paddingTop: '2rem'}}>
                    {isMobile ? (
                        <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange}>
                            <PrimaryButton text="Dokončit" disabled={isSubmitDisabled()} onClick={handleOnSubmit} type="button" />
                        </ZadavaniNalezu>
                    ) : (
                        <Container>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <Box mb={3}>
                                        <Typography variant="h5" color={primary}>
                                            Vyplňte prosím podrobnosti o nálezu
                                        </Typography>
                                    </Box>
                                    <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange}>
                                        <PrimaryButton text="Dokončit" disabled={isSubmitDisabled()} onClick={handleOnSubmit} />
                                    </ZadavaniNalezu>
                                </Grid>
                                <Grid item sm={6} maxHeight={700}>
                                    <MapComponent locked>
                                        <FloatinButtonContainer>
                                            <SecondaryButton text="Editovat místo" onClick={handleEditLocation} />
                                        </FloatinButtonContainer>
                                    </MapComponent>
                                </Grid>
                            </Grid>
                        </Container>
                    )}
                </SyringeLayout>
            );
        case StepsEnum.Nahled:
            return (
                <SyringeLayout sx={{paddingTop: '2rem'}}>
                    {isMobile ? (
                        <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange} handleEditLocation={handleEditLocation} readOnly>
                            <Box display="flex" justifyContent="center" flexDirection="column">
                                <PrimaryButton text="Uložit" onClick={handleOnSave} />
                                <Box display="flex" mt={3} justifyContent="center">
                                    <TextButton fontSize={18} color={primary} text="Editovat nález" onClick={handleGoToEdit} textTransform="uppercase" />
                                </Box>
                            </Box>
                        </ZadavaniNalezu>
                    ) : (
                        <Container>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange} readOnly>
                                        <PrimaryButton text="Dokončit" onClick={handleOnSave} type="button" />
                                    </ZadavaniNalezu>
                                </Grid>
                                <Grid item md={6} maxHeight={700}>
                                    <MapComponent locked />
                                </Grid>
                            </Grid>
                        </Container>
                    )}
                </SyringeLayout>
            );

        case StepsEnum.Potvrzeni:
            return (
                <SyringeLayout sx={{padding: 0}}>
                    <Potvrzeni />
                </SyringeLayout>
            );
        default:
            return (
                <SyringeLayout>
                    <Info />
                </SyringeLayout>
            );
    }
};

interface INovyNalez {
    newSyringeInfo: INovaJehla;
    handleInputChange: (key: string, value: string | number) => void;
    handleOnSubmit: () => void;
    handleOnSave: () => void;
    handleGoToEdit: () => void;
    handleEditLocation: () => void;
}

export interface AddSyringeLayoutProps extends Pick<ContainerProps, 'sx'> {}


const SyringeLayout: FC<AddSyringeLayoutProps> = ({ children, sx }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    if (!isMobile) {
        return (
            <>
                <Stepper />
                <Container maxWidth="lg" sx={{ flexGrow: 1 , ...sx}} id="content-container">
                    {children}
                </Container>
            </>
        );
    }
    return (
        <Container maxWidth="lg" sx={{ flexGrow: 1 , ...sx}} id="content-container">
            {children}
        </Container>
    );
};

export default NovyNalezContainer;
