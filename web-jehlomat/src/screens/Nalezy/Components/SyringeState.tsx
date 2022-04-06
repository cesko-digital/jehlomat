import React, { FunctionComponent } from 'react';
import { Syringe } from '../types/Syringe';
import { TextGold, TextHighlight, TextMuted } from './Text';

interface SyringeStateProps {
    syringe: Syringe;
}

const SyringeState: FunctionComponent<SyringeStateProps> = ({ syringe }) => {
    if (syringe.demolishedAt && syringe.demolished) {
        return <TextMuted>Zlikvidováno</TextMuted>;
    }

    if (syringe.reservedTill) {
        return <TextHighlight>Rezervováno TP</TextHighlight>;
    }

    return <TextGold>Čeká na likvidaci</TextGold>;
};

export default SyringeState;
