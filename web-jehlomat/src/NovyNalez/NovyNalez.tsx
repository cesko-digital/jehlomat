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

export enum STEPS {
    Start,
    Mapa,
    Info,
    Potvrzeni,
    Nahled,
}

const NovyNalez: FC<INovyNalez> = ({}) => {
    const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.Start);

    const [newSyringeInfo, setNewSyringeInfo] = useState<INovaJehla>({ lat: undefined, lng: undefined, info: '', datetime: '', count: undefined });

    const handleStepChange = (newStep: STEPS, newInfo?: Partial<INovaJehla>) => {
        if (newInfo != null) {
            const { lat, lng } = newInfo;
            setNewSyringeInfo({ ...newSyringeInfo, lat, lng });
        }
        setCurrentStep(newStep);
    };

    const handleInputChange = (key: string, value: string) => setNewSyringeInfo({ ...newSyringeInfo, [key]: value });

    const handleOnSubmit = () => {
        // TO-DO: Validace nebo nahradit formularem z formiku
        setCurrentStep(STEPS.Nahled);
    };

    const handleOnSave = () => {
        try {
            // ASYNC CALL TO BE
            setCurrentStep(STEPS.Potvrzeni);
        } catch (error) {
            // Error handling 101
            console.log(error);
        }
    };

    const handleOnEdit = () => setCurrentStep(STEPS.Info);
    const handleOnLocationChange = () => setCurrentStep(STEPS.Mapa);

    // Debugging of New Syringe info
    useEffect(() => {
        console.log('NEW SYRINGE INFO:', newSyringeInfo);
    }, [newSyringeInfo]);

    switch (currentStep) {
        case STEPS.Start:
            return <Info handleStepChange={handleStepChange} />;
        case STEPS.Mapa:
            return <ZadatNalezMapa handleStepChange={handleStepChange} userSelectedLocation={[newSyringeInfo.lat, newSyringeInfo.lng]} />;
        case STEPS.Info:
            return <ZadavaniNalezu syringeInfo={newSyringeInfo} onInputChange={handleInputChange} onSumbit={handleOnSubmit} />;
        case STEPS.Nahled:
            return <NahledNalezu syringeInfo={newSyringeInfo} onSaveClick={handleOnSave} onEditClick={handleOnEdit} onLocationChangeClick={handleOnLocationChange} />;
        case STEPS.Potvrzeni:
            return <Potvrzeni />;
        default:
            return <Info handleStepChange={handleStepChange} />;
    }
};

export default NovyNalez;
