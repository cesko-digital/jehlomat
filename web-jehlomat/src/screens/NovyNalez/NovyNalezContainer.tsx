import { useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FC, useContext, useState } from 'react';
import dayjs from 'dayjs';

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
// import Stepper from './Components/Stepper';

export interface INovaJehla {
    lat: number | undefined;
    lng: number | undefined;
    info: string | undefined;
    datetime: number | undefined; // unix
    count: number | undefined;
    photo: string | undefined;
}

export enum StepsEnum {
    Start,
    Mapa,
    Info,
    Nahled,
    Potvrzeni,
}

const StepsTitleMap = new Map<StepsEnum, string>([
    [StepsEnum.Start, 'Start přidání nálezu'],
    [StepsEnum.Mapa, 'Zadejte nález na mapě'],
    [StepsEnum.Info, 'Info'],
    [StepsEnum.Nahled, 'Náhled stříkačky'],
    [StepsEnum.Potvrzeni, 'Potvrzení stříkačky'],
]);

const NovyNalezContainer: FC = () => {
    const [currentStep, setCurrentStep] = useState<StepsEnum>(StepsEnum.Start);
    const isMobile = useMediaQuery(media.lte('mobile'));
    const [newSyringeInfo, setNewSyringeInfo] = useState<INovaJehla>({ lat: undefined, lng: undefined, info: '', datetime: dayjs().unix(), count: undefined, photo: undefined });

    useEffect(() => {
        // skip first step on desktop
        if (!isMobile && currentStep === StepsEnum.Start) {
            setCurrentStep(StepsEnum.Mapa);
        }
    }, [isMobile, currentStep]);

    const handleStepChange = (newStep: StepsEnum, newInfo?: Partial<INovaJehla>) => {
        if (newInfo != null) {
            const { lat, lng } = newInfo;
            setNewSyringeInfo({ ...newSyringeInfo, lat, lng });
        }
        setCurrentStep(newStep);
    };

    const handleInputChange = (key: string, value: string | number) => setNewSyringeInfo({ ...newSyringeInfo, [key]: value });

    const handleOnSubmit = () => {
        setCurrentStep(StepsEnum.Nahled);
    };

    const handleOnSave = async () => {
        try {
            const { lat, lng, datetime, count, info, photo } = newSyringeInfo;

            const apiSyringe = {
                createdAt: datetime,
                gps_coordinates: `${lat} ${lng}`,
                note: info,
                photo,
                ...(count ? { count: typeof count === 'number' ? count : parseInt(count) } : {}),
            };

            const data = await API.post('/api/v1/jehlomat/syringe', apiSyringe);

            console.log('returned data', data);
            if (data.status === 200 || data.status === 201) {
                setCurrentStep(StepsEnum.Potvrzeni);
            }
        } catch (error) {
            // Error handling 101
            console.log(error);
        }
    };

    const handleOnEdit = () => setCurrentStep(StepsEnum.Info);
    const handleOnLocationChange = () => setCurrentStep(StepsEnum.Mapa);

    const handleGoToEdit = useCallback(() => {
        setCurrentStep(StepsEnum.Info);
    }, []);

    const handleEditLocation = useCallback(() => {
        setCurrentStep(StepsEnum.Mapa);
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header mobileTitle={StepsTitleMap.get(currentStep) || ''} />
            {/* If desktop show stepper */}
            {/* {currentStep != 0 && <Stepper currentStep={currentStep} />} */}
            <Container maxWidth="lg" sx={{ flexGrow: 1 }} id="content-container">
                <NovyNalez
                    currentStep={currentStep}
                    newSyringeInfo={newSyringeInfo}
                    handleStepChange={handleStepChange}
                    handleInputChange={handleInputChange}
                    handleOnSubmit={handleOnSubmit}
                    handleOnEdit={handleOnEdit}
                    handleOnLocationChange={handleOnLocationChange}
                    handleOnSave={handleOnSave}
                    handleGoToEdit={handleGoToEdit}
                    handleEditLocation={handleEditLocation}
                />
            </Container>
        </Box>
    );
};

const NovyNalez: FC<INovyNalez> = ({
    currentStep,
    newSyringeInfo,
    handleInputChange,
    handleOnEdit,
    handleOnLocationChange,
    handleOnSave,
    handleOnSubmit,
    handleStepChange,
    handleGoToEdit,
    handleEditLocation,
}) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    switch (currentStep) {
        case StepsEnum.Start:
            return <Info handleStepChange={handleStepChange} />;
        case StepsEnum.Mapa:
            return <ZadatNalezMapa handleStepChange={handleStepChange} userSelectedLocation={[newSyringeInfo.lat, newSyringeInfo.lng]} />;
        case StepsEnum.Info:
            return (
                <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange}>
                    <PrimaryButton text="Dokončit" onClick={handleOnSubmit} />
                </ZadavaniNalezu>
            );
        case StepsEnum.Nahled:
            return (
                <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange} handleEditLocation={handleEditLocation} readOnly>
                    <Box display="flex" justifyContent="center" flexDirection="column">
                        <PrimaryButton text="Uložit" onClick={handleOnSave} />
                        <Box display="flex" mt={3} justifyContent="center">
                            <TextButton fontSize={18} color={primary} text="Editovat nález" onClick={handleGoToEdit} textTransform="uppercase" />
                        </Box>
                    </Box>
                </ZadavaniNalezu>
            );

        case StepsEnum.Potvrzeni:
            return <Potvrzeni />;
        default:
            return <Info handleStepChange={handleStepChange} />;
    }
};

interface INovyNalez {
    currentStep: StepsEnum;
    newSyringeInfo: INovaJehla;
    handleStepChange: (newStep: StepsEnum, newInfo?: Partial<INovaJehla>) => void;
    handleInputChange: (key: string, value: string | number) => void;
    handleOnSubmit: () => void;
    handleOnSave: () => void;
    handleOnEdit: () => void;
    handleOnLocationChange: () => void;
    handleGoToEdit: () => void;
    handleEditLocation: () => void;
}

export default NovyNalezContainer;
