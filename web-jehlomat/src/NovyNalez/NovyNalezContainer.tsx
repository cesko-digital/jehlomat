import Box from '@mui/material/Box';
import { FC, useState } from 'react';
import { Footer } from '../Components/Footer/Footer';
import { Header } from '../Components/Header/Header';
import Info from './Components/Info';
import NahledNalezu from './Components/NahledNalezu';
import Potvrzeni from './Components/Potvrzeni';
import ZadatNalezMapa from './Components/ZadatNalezMapa';
import ZadavaniNalezu from './Components/ZadavaniNalezu';
import Container from '@mui/material/Container';
import Stepper from './Components/Stepper';

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

const NovyNalezContainer: FC = () => {
    const [currentStep, setCurrentStep] = useState<StepsEnum>(StepsEnum.Start);

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

    const handleOnSave = () => {
        try {
            // ASYNC CALL TO BE
            setCurrentStep(StepsEnum.Potvrzeni);
        } catch (error) {
            // Error handling 101
            console.log(error);
        }
    };

    const handleOnEdit = () => setCurrentStep(StepsEnum.Info);
    const handleOnLocationChange = () => setCurrentStep(StepsEnum.Mapa);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header />
            {/* If desktop show stepper */}
            {currentStep != 0 && <Stepper currentStep={currentStep} />}
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
            // Chybi logika odeslani na server
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
