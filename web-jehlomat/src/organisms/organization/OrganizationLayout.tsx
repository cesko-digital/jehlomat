import { Box, useMediaQuery } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { Header } from '../../Components/Header/Header';
import { secondaryColorVariant } from '../../utils/colors';
import PenIcon from '../../assets/icons/pen.svg';
import MessageIcon from '../../assets/icons/message.svg';
import PenInactiveIcon from '../../assets/icons/penInactive.svg';
import CheckInactiveIcon from '../../assets/icons/checkInactive.svg';
import MessageInactiveIcon from '../../assets/icons/messageInactive.svg';
import CheckSecondaryIcon from '../../assets/icons/checkSecondary.svg';
import { SStep, SIcon, SSubTitle, SContainer } from './OrganizationLayout.styled';
import { media } from '../../utils/media';

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
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <>
            <Header backRoute={backRoute} mobileTitle={title || ''} />

            {!isMobile && (
                <Box minHeight={1} display="flex">
                    <SStep initialStep={0 === step} active={0 <= step} flex={1} bgcolor={secondaryColorVariant('light')}>
                        <SIcon active={0 <= step}>
                            <img src={0 <= step ? PenIcon : PenInactiveIcon} alt="vytvoření účtu" />
                        </SIcon>

                        <SSubTitle>zadání údajů k vytvoření účtu</SSubTitle>
                    </SStep>
                    <SStep active={1 <= step} flex={1} bgcolor={secondaryColorVariant('regular')}>
                        <SIcon active={1 <= step}>
                            <img src={1 <= step ? MessageIcon : MessageInactiveIcon} alt="ověření e-mailové adresy" />
                        </SIcon>

                        <SSubTitle>ověření e-mailové adresy</SSubTitle>
                    </SStep>
                    <SStep active={2 <= step} flex={1} bgcolor={secondaryColorVariant('dark')}>
                        <SIcon inverted active={2 <= step}>
                            <img src={2 <= step ? CheckSecondaryIcon : CheckInactiveIcon} alt="úspěšné založení účtu" />
                        </SIcon>

                        <SSubTitle>úspěšné založení účtu</SSubTitle>
                    </SStep>
                </Box>
            )}

            <SContainer>{children}</SContainer>
        </>
    );
}
