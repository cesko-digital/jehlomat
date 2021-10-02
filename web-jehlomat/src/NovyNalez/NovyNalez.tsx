import { FC, useState } from 'react';
import Info from './Components/Info';
import Potvrzeni from './Components/Potvrzeni';
import ZadatNalezMapa from './Components/ZadatNalezMapa';
import ZadavaniNalezu from './Components/ZadavaniNalezu';

interface INovyNalez {}

export enum STEPS {
    Start,
    Mapa,
    Info,
    Potvrzeni,
}

const NovyNalez: FC<INovyNalez> = ({}) => {
    const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.Start);

    const handleStepChange = (newStep: STEPS) => setCurrentStep(newStep);

    switch (currentStep) {
        case STEPS.Start:
            return <Info handleStepChange={handleStepChange} />;
        case STEPS.Mapa:
            return <ZadatNalezMapa />;
        case STEPS.Info:
            return <ZadavaniNalezu />;
        case STEPS.Potvrzeni:
            return <Potvrzeni />;
        default:
            return <Info handleStepChange={handleStepChange} />;
    }
};

export default NovyNalez;
