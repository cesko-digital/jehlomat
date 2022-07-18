import React, { useCallback, ReactNode, useState } from 'react';
import { FC } from 'react';
import Box from '@mui/material/Box';
import Container, { ContainerProps } from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { AxiosResponse } from 'axios';

import { isExistingSyringe, JehlaState, StepsEnum } from 'screens/Nalezy/NovyNalez/components/types';
import { Header } from 'Components/Header/Header';
import Info from 'screens/Nalezy/NovyNalez/components/Info';
import Potvrzeni from 'screens/Nalezy/NovyNalez/screens/Potvrzeni';
import ZadatNalezMapa from 'screens/Nalezy/NovyNalez/screens/ZadatNalezMapa';
import ZadavaniNalezu from 'screens/Nalezy/NovyNalez/screens/ZadavaniNalezu';
import { API } from 'config/baseURL';
import { primary } from 'utils/colors';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from 'Components/Buttons/TextButton/TextButton';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';

import { useRecoilState, useRecoilValue } from 'recoil';
import { newSyringeInfoErrorState, newSyringeInfoState, newSyringeStepState } from 'screens/Nalezy/NovyNalez/components/store';
import MapComponent from 'screens/Nalezy/NovyNalez/components/Map';
import { FloatinButtonContainer } from 'screens/Nalezy/NovyNalez/components/styled';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import Stepper from 'screens/Nalezy/NovyNalez/components/Stepper';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import RoundButton from 'screens/Nalezy/Components/RoundButton';
import { ReactComponent as BackIcon } from 'assets/icons/chevron-left.svg';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/system';

const StepsTitleMap = new Map<StepsEnum, string>([
    [StepsEnum.Start, 'Start přidání nálezu'],
    [StepsEnum.Mapa, 'Zadejte nález na mapě'],
    [StepsEnum.Info, 'Info'],
    [StepsEnum.Nahled, 'Náhled stříkačky'],
    [StepsEnum.Potvrzeni, 'Potvrzení stříkačky'],
]);

const NalezContainer: FC<{ edit?: boolean }> = () => {
    const [currentStep, setCurrentStep] = useRecoilState(newSyringeStepState);
    const [newSyringeInfo, setNewSyringeInfo] = useRecoilState(newSyringeInfoState);
    const [trackingCode, setTrackingCode] = useState<string | null>(null);

    const handleInputChange = (key: string, value: string | number) => setNewSyringeInfo({ ...newSyringeInfo, [key]: value });

    const handleOnSubmit = () => {
        setCurrentStep(StepsEnum.Nahled);
        setTrackingCode(null);
    };

    const handleOnSave = async () => {
        try {
            const { lat, lng, datetime, count, info, photo } = newSyringeInfo;

            let apiSyringe: Partial<Syringe> = {
                createdAt: datetime,
                gps_coordinates: `${lng} ${lat}`,
                note: info,
                photo,
                ...(count ? { count: typeof count === 'number' ? count : parseInt(count) } : {}),
            };

            let data: AxiosResponse<any>;

            if ('id' in newSyringeInfo && newSyringeInfo.id) {
                const { id } = newSyringeInfo;

                data = await API.put(`/syringe/${id}/summary`, apiSyringe);
            } else {
                data = await API.post('/syringe', apiSyringe);
            }

            if (data.status > 200 && data.status < 300) {
                setCurrentStep(StepsEnum.Potvrzeni);
                setTrackingCode(data.data.id);
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
            <NovyNalez {...{ newSyringeInfo, handleInputChange, handleOnSubmit, handleOnSave, handleGoToEdit, handleEditLocation, trackingCode }} />
        </Box>
    );
};

const NovyNalez: FC<INovyNalez> = ({ newSyringeInfo, handleInputChange, handleOnSave, handleOnSubmit, handleGoToEdit, handleEditLocation, trackingCode }) => {
    const [currentStep] = useRecoilState(newSyringeStepState);
    const newSyringeInfoError = useRecoilValue(newSyringeInfoErrorState);
    const isMobile = useMediaQuery(media.lte('mobile'));

    const isSubmitDisabled = () => {
        // Pokud je na formulari chyba, zablokujeme Submit button
        return !Object.values(newSyringeInfoError).every(error => error === undefined);
    };

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
                <SyringeLayout sx={{ paddingTop: '2rem' }}>
                    {isMobile ? (
                        <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange}>
                            <PrimaryButton text="Uložit" disabled={isSubmitDisabled()} onClick={handleOnSubmit} type="button" />
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
                                        <PrimaryButton text="Uložit" disabled={isSubmitDisabled()} onClick={handleOnSubmit} />
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
                <SyringeLayout sx={{ paddingTop: '2rem' }}>
                    {isMobile ? (
                        <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange} handleEditLocation={handleEditLocation} readOnly>
                            <Box display="flex" justifyContent="center" flexDirection="column">
                                <PrimaryButton text={isExistingSyringe(newSyringeInfo) && newSyringeInfo.edit ? 'Uložit' : 'Dokončit'} onClick={handleOnSave} />
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
                                        <PrimaryButton text={isExistingSyringe(newSyringeInfo) && newSyringeInfo.edit ? 'Uložit' : 'Dokončit'} onClick={handleOnSave} type="button" />
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
                <SyringeLayout sx={{ padding: 0 }}>
                    <Potvrzeni trackingCode={trackingCode} />
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
    newSyringeInfo: JehlaState;
    handleInputChange: (key: string, value: string | number) => void;
    handleOnSubmit: () => void;
    handleOnSave: () => void;
    handleGoToEdit: () => void;
    handleEditLocation: () => void;
    trackingCode: string | null;
}

export interface AddSyringeLayoutProps extends Pick<ContainerProps, 'sx'> {}

const BackButton = styled(RoundButton)`
    position: absolute;
    left: -50px;
`;

const SyringeLayout: FC<AddSyringeLayoutProps> = ({ children, sx }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const history = useHistory();
    const [newSyringeInfo] = useRecoilState(newSyringeInfoState);

    const handleGetBack = useCallback(() => {
        history.push('/nalezy');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderContainer = (child: ReactNode) => (
        <Container maxWidth="lg" sx={{ flexGrow: 1, position: 'relative', ...sx }} id="content-container">
            {isExistingSyringe(newSyringeInfo) && (
                <BackButton filled={true} onClick={handleGetBack}>
                    <BackIcon />
                </BackButton>
            )}
            {child}
        </Container>
    );

    if (!isMobile) {
        return (
            <>
                <Stepper />
                {renderContainer(<>{children}</>)}
            </>
        );
    }
    return renderContainer(children);
};

export default NalezContainer;
