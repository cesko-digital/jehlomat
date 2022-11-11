import React, { FunctionComponent } from 'react';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { TextGold, TextHighlight, TextMuted } from 'screens/Nalezy/Components/Text';

interface SyringeStateProps {
    syringe: Syringe;
}

const SyringeState: FunctionComponent<SyringeStateProps> = ({ syringe }) => {
    if (syringe.demolishedAt && syringe.demolished) {
        return <TextMuted>Zlikvidováno</TextMuted>;
    }

    if (syringe.reservedBy) {
        return <TextHighlight>Rezervováno</TextHighlight>;
    }

    return <TextGold>Čeká na likvidaci</TextGold>;
};

export default SyringeState;
