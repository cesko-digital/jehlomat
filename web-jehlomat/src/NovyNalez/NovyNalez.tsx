import { FC, useEffect, useState } from 'react';
import Info from './Components/Info';
import NahledNalezu from './Components/NahledNalezu';
import Potvrzeni from './Components/Potvrzeni';
import ZadatNalezMapa from './Components/ZadatNalezMapa';
import ZadavaniNalezu from './Components/ZadavaniNalezu';

interface INovyNalez {}

export interface INovaJehla {
    lat: number | undefined;
    lng: number | undefined;
    info: string | undefined;
    datetime: string | undefined;
    count: number | undefined;
    // TO-DO: Přidat možnost fotky
}

export enum Steps {
    Start,
    Mapa,
    Info,
    Potvrzeni,
    Nahled,
}

const NovyNalez: FC<INovyNalez> = ({}) => {
    const [currentStep, setCurrentStep] = useState<Steps>(Steps.Start);

    const [newSyringeInfo, setNewSyringeInfo] = useState<INovaJehla>({ lat: undefined, lng: undefined, info: '', datetime: '', count: undefined });

    const handleStepChange = (newStep: Steps, newInfo?: Partial<INovaJehla>) => {
        if (newInfo != null) {
            const { lat, lng } = newInfo;
            setNewSyringeInfo({ ...newSyringeInfo, lat, lng });
        }
        setCurrentStep(newStep);
    };

    const handleInputChange = (key: string, value: string) => setNewSyringeInfo({ ...newSyringeInfo, [key]: value });

    const handleOnSubmit = () => {
        setCurrentStep(Steps.Nahled);
    };

    const handleOnSave = () => {
        try {
            // ASYNC CALL TO BE
            setCurrentStep(Steps.Potvrzeni);
        } catch (error) {
            // Error handling 101
            console.log(error);
        }
    };

    const handleOnEdit = () => setCurrentStep(Steps.Info);
    const handleOnLocationChange = () => setCurrentStep(Steps.Mapa);

    switch (currentStep) {
        case Steps.Start:
            return <Info handleStepChange={handleStepChange} />;
        case Steps.Mapa:
            return <ZadatNalezMapa handleStepChange={handleStepChange} userSelectedLocation={[newSyringeInfo.lat, newSyringeInfo.lng]} />;
        case Steps.Info:
            return <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange} onSumbit={handleOnSubmit} />;
        case Steps.Nahled:
            // Chybi logika odeslani na server
            return <NahledNalezu syringeInfo={newSyringeInfo} onSaveClick={handleOnSave} onEditClick={handleOnEdit} onLocationChangeClick={handleOnLocationChange} />;
        case Steps.Potvrzeni:
            return <Potvrzeni />;
        default:
            return <Info handleStepChange={handleStepChange} />;
    }
};

export default NovyNalez;
