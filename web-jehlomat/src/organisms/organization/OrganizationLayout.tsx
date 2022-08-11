import { PropsWithChildren } from 'react';
import { Header } from '../../Components/Header/Header';
import PenIcon from '../../assets/icons/pen.svg';
import MessageIcon from '../../assets/icons/message.svg';
import PenInactiveIcon from '../../assets/icons/penInactive.svg';
import CheckInactiveIcon from '../../assets/icons/checkInactive.svg';
import MessageInactiveIcon from '../../assets/icons/messageInactive.svg';
import { StepperContainer, StepperCard } from 'Components/Stepper/Stepper';
import { IconImage, SContainer } from './OrganizationLayout.styled';

export enum RegistrationStep {
    CREATE,
    VERIFY,
    SUCCESS,
}

interface Props {
    title?: string;
    backRoute?: string;
    step: RegistrationStep;
}

export function OrganizationLayout(props: PropsWithChildren<Props>) {
    const { step, title, children, backRoute } = props;

    return (
        <>
            <Header backRoute={backRoute} mobileTitle={title || ''} />

            <StepperContainer>
                <StepperCard currentStep={step} order={0} title="zadání údajů k vytvoření účtu">
                    <IconImage src={1 <= step ? PenIcon : PenInactiveIcon} alt="vytvoření účtu" />
                </StepperCard>
                <StepperCard currentStep={step} order={1} title="ruční schválení organizace">
                    <IconImage src={2 <= step ? MessageIcon : MessageInactiveIcon} alt="ruční schválení organizace" />
                </StepperCard>
                <StepperCard currentStep={step} order={2} title="úspěšné založení účtu">
                    <IconImage src={CheckInactiveIcon} alt="úspěšné založení účtu" />
                </StepperCard>
            </StepperContainer>

            <SContainer>{children}</SContainer>
        </>
    );
}
