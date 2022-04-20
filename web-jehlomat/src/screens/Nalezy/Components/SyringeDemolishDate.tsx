import React, { FunctionComponent } from 'react';
import dayjs from 'dayjs';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { TextMuted } from 'screens/Nalezy/Components/Text';

interface SyringeDemolishDateProps {
    syringe: Syringe;
}

const SyringeDemolishDate: FunctionComponent<SyringeDemolishDateProps> = ({ syringe }) => {
    if (syringe.demolishedAt && syringe.demolished) {
        return <>{dayjs(syringe.demolishedAt * 1000).format('D. M. YYYY')}</>;
    }

    if (syringe.reservedTill) {
        return <TextMuted>rezervace do {dayjs(syringe.reservedTill * 1000).format('D. M. YYYY')}</TextMuted>;
    }

    return <TextMuted>zatím nezlikvidováno</TextMuted>;
};

export default SyringeDemolishDate;
