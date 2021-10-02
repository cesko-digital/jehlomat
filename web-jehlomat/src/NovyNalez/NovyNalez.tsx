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
    const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.Info);

    const [newSyringeInfo, setNewSyringeInfo] = useState<INovaJehla>({ lat: undefined, lng: undefined, info: '', datetime: '' });

    const handleStepChange = (newStep: STEPS, newInfo?: Partial<INovaJehla>) => {
        if (newInfo != null) {
            const { lat, lng, info, datetime } = newInfo;
            setNewSyringeInfo({ lat, lng, info, datetime });
        }
        setCurrentStep(newStep);
    };

    // Debugging of New Syringe info
    useEffect(() => {
        console.log('NEW SYRINGE INFO:', newSyringeInfo);
    }, [newSyringeInfo]);

    switch (currentStep) {
        case STEPS.Start:
            return <Info handleStepChange={handleStepChange} />;
        case STEPS.Mapa:
            return <ZadatNalezMapa handleStepChange={handleStepChange} />;
        case STEPS.Info:
            return <ZadavaniNalezu />;
        case STEPS.Nahled:
            return <NahledNalezu />;
        case STEPS.Potvrzeni:
            return <Potvrzeni />;
        default:
            return <Info handleStepChange={handleStepChange} />;
    }
};

export default NovyNalez;
