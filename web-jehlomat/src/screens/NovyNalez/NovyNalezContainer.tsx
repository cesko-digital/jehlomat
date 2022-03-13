import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FC, useContext, useState } from 'react';
import dayjs from 'dayjs';
import { Footer } from 'Components/Footer/Footer';
import { Header } from 'Components/Header/Header';
import Info from 'screens/NovyNalez/components/Info';
import NahledNalezu from 'screens/NovyNalez/screens/NahledNalezu';
import Potvrzeni from 'screens/NovyNalez/screens/Potvrzeni';
import ZadatNalezMapa from 'screens/NovyNalez/screens/ZadatNalezMapa';
import ZadavaniNalezu from 'screens/NovyNalez/screens/ZadavaniNalezu';
import { authorizedAPI } from 'config/baseURL';
import { LoginContext } from 'utils/login';
import { isNumber } from 'util';
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
    const { token } = useContext(LoginContext);

    const [newSyringeInfo, setNewSyringeInfo] = useState<INovaJehla>({ lat: undefined, lng: undefined, info: '', datetime: dayjs().unix(), count: undefined, photo: undefined });

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

            const data = await authorizedAPI(token).post('/api/v1/jehlomat/syringe', apiSyringe);

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
                />
            </Container>
        </Box>
    );
};

const NovyNalez: FC<INovyNalez> = ({ currentStep, newSyringeInfo, handleInputChange, handleOnEdit, handleOnLocationChange, handleOnSave, handleOnSubmit, handleStepChange }) => {
    switch (currentStep) {
        case StepsEnum.Start:
            return <Info handleStepChange={handleStepChange} />;
        case StepsEnum.Mapa:
            return <ZadatNalezMapa handleStepChange={handleStepChange} userSelectedLocation={[newSyringeInfo.lat, newSyringeInfo.lng]} />;
        case StepsEnum.Info:
            return <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange} onSumbit={handleOnSubmit} />;
        case StepsEnum.Nahled:
            return <NahledNalezu syringeInfo={newSyringeInfo} onSaveClick={handleOnSave} onEditClick={handleOnEdit} onLocationChangeClick={handleOnLocationChange} />;
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
}

export default NovyNalezContainer;
