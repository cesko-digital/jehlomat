import { FC } from 'react';
import { StepsEnum } from '../NovyNalezContainer';

interface IStepper {
    currentStep: StepsEnum;
}
const Stepper: FC<IStepper> = ({ currentStep }) => {
    return <div>stepper: {currentStep}</div>;
};

export default Stepper;
