import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FC, useContext, useState } from 'react';
import dayjs from 'dayjs';
import { Footer } from 'Components/Footer/Footer';
import { Header } from 'Components/Header/Header';
import Info from 'screens/NovyNalez/components/Info';
import NahledNalezu from 'screens/NovyNalez/components/NahledNalezu';
import Potvrzeni from './components/Potvrzeni';
import ZadatNalezMapa from './components/ZadatNalezMapa';
import ZadavaniNalezu from './components/ZadavaniNalezu';
import { authorizedAPI } from 'config/baseURL';
import { LoginContext } from 'utils/login';
import { isNumber } from 'util';
// import Stepper from './Components/Stepper';

export interface INovaJehla {
    lat: number | undefined;
    lng: number | undefined;
    info: string | undefined;
    datetime: string | undefined;
    count: number | undefined;
    // TODO: Přidat možnost fotky
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

    const [newSyringeInfo, setNewSyringeInfo] = useState<INovaJehla>({ lat: undefined, lng: undefined, info: '', datetime: '', count: undefined });

    const handleStepChange = (newStep: StepsEnum, newInfo?: Partial<INovaJehla>) => {
        if (newInfo != null) {
            const { lat, lng } = newInfo;
            setNewSyringeInfo({ ...newSyringeInfo, lat, lng });
        }
        setCurrentStep(newStep);
    };

    const handleInputChange = (key: string, value: string) => setNewSyringeInfo({ ...newSyringeInfo, [key]: value });

    const handleOnSubmit = () => {
        setCurrentStep(StepsEnum.Nahled);
    };

    const handleOnSave = async () => {
        try {
            const { lat, lng, datetime, count, info } = newSyringeInfo;
            const dateObj = dayjs(datetime);

            const apiSyringe = {
                createdAt: dateObj.unix(),
                gps_coordinates: `${lat},${lng}`,
                note: info,
                ...(count ? { count: typeof count === 'number' ? count : parseInt(count) } : {}),
            };

            const data = await authorizedAPI(token).post('/api/v1/jehlomat/syringe', apiSyringe);

            console.log('returned data', data);
            if (data.status === 200) {
                setCurrentStep(StepsEnum.Potvrzeni);
            }
        } catch (error) {
            // Error handling 101
            console.log(error);
        }
    };

    const handleOnEdit = () => setCurrentStep(StepsEnum.Info);
    const handleOnLocationChange = () => setCurrentStep(StepsEnum.Mapa);

    useEffect(() => {
        // check syringe data and no datetime set, set now
        if(currentStep === StepsEnum.Nahled){
            const {  datetime } = newSyringeInfo;

            if(!datetime ) {
                handleInputChange('datetime', dayjs())
            }
        }
    }, [currentStep]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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

            <Footer />
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
    handleInputChange: (key: string, value: string) => void;
    handleOnSubmit: () => void;
    handleOnSave: () => void;
    handleOnEdit: () => void;
    handleOnLocationChange: () => void;
}

export default NovyNalezContainer;
